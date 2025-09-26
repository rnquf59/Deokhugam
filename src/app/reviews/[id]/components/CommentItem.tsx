"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import Label from "@/components/ui/Buttons/Label";
import Button from "@/components/ui/Buttons/Button";
import Textarea from "@/components/ui/Textarea";
import ActionMenu from "@/components/common/ActionMenu";
import { useAuthStore } from "@/store/authStore";
import { useTooltipStore } from "@/store/tooltipStore";
import { updateComment, deleteComment } from "@/api/comments";
import type { Comment } from "@/types/reviews";

interface CommentItemProps {
  comment: Comment;
  onCommentUpdate?: (updatedComment: Comment) => void;
  onCommentDelete?: (deletedCommentId: string) => void;
}

export default function CommentItem({
  comment,
  onCommentUpdate,
  onCommentDelete
}: CommentItemProps) {
  const { user } = useAuthStore();
  const isMyComment = user?.id === comment.userId;
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
  const showTooltip = useTooltipStore(state => state.showTooltip);

  const actionMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(e.target as Node)
      ) {
        setIsActionMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMoreClick = useCallback(() => {
    if (isMyComment) {
      setIsActionMenuOpen(!isActionMenuOpen);
    }
  }, [isMyComment, isActionMenuOpen]);

  const handleEdit = useCallback(() => {
    setIsEditMode(true);
    setIsActionMenuOpen(false);
    // textarea에 포커스 및 내용 설정
    setTimeout(() => {
      if (editTextareaRef.current) {
        editTextareaRef.current.value = comment.content;
        editTextareaRef.current.focus();
      }
    }, 0);
  }, [comment.content]);

  const handleCancel = useCallback(() => {
    setIsEditMode(false);
  }, []);

  const handleSave = useCallback(async () => {
    const content = editTextareaRef.current?.value?.trim();
    if (!content) return;

    setIsSubmittingEdit(true);
    try {
      const updatedComment = await updateComment({
        commentId: comment.id,
        content
      });
      setIsEditMode(false);
      // 수정된 댓글 전달
      onCommentUpdate?.(updatedComment);
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      // TODO: 에러 처리 (토스트 메시지 등)
    } finally {
      setIsSubmittingEdit(false);
    }
  }, [comment.id, onCommentUpdate]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteComment(comment.id);
      setIsActionMenuOpen(false);
      // 삭제된 댓글 ID 전달
      onCommentDelete?.(comment.id);

      // 토스트 메시지 표시 (아이콘 없이)
      showTooltip("댓글이 삭제되었습니다.", "");
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      // TODO: 에러 처리 (토스트 메시지 등)
    }
  }, [comment.id, onCommentDelete, showTooltip]);

  return (
    <div
      className={`${isEditMode ? "pt-[24px] pb-0 border-b-0" : "py-[24px] border-b border-gray-100"}`}
    >
      <div className="flex flex-col gap-[10px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[6px]">
            <div className="flex items-center gap-[4px]">
              <span className="my-[3.5px] text-body3 font-semibold text-gray-600">
                {comment.userNickname}
              </span>
              {isMyComment && <Label>내 댓글</Label>}
            </div>
            <span className="my-[3.5px] text-body3 font-medium text-gray-400">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          {isMyComment && !isEditMode && (
            <div className="relative" ref={actionMenuRef}>
              <Image
                src="/images/icon/ic_more.svg"
                alt="더보기"
                width={24}
                height={24}
                className="cursor-pointer relative z-0"
                onClick={handleMoreClick}
              />
              {isActionMenuOpen && (
                <ActionMenu onEdit={handleEdit} onDelete={handleDelete} />
              )}
            </div>
          )}
        </div>

        {isEditMode ? (
          <div className="flex flex-col gap-[10px]">
            <Textarea
              ref={editTextareaRef}
              placeholder="댓글을 수정해주세요"
              className="h-[120px]"
            />
            <div className="flex justify-end gap-[12px]">
              <Button variant="secondary" onClick={handleCancel}>
                취소
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isSubmittingEdit}
              >
                {isSubmittingEdit ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-50 mx-auto" />
                ) : (
                  "등록"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-body2 font-medium text-gray-800">
            {comment.content}
          </div>
        )}
      </div>
    </div>
  );
}
