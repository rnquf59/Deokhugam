"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Label from "@/components/ui/Buttons/Label";
import Button from "@/components/ui/Buttons/Button";
import Textarea from "@/components/ui/Textarea";
import ActionMenu from "@/components/common/ActionMenu";
import { useAuthStore } from "@/store/authStore";
import { updateComment, deleteComment } from "@/api/comments";
import type { Comment } from "@/types/reviews";

interface CommentItemProps {
  comment: Comment;
  onCommentUpdate?: () => void;
}

export default function CommentItem({
  comment,
  onCommentUpdate
}: CommentItemProps) {
  const { user } = useAuthStore();
  const isMyComment = user?.id === comment.userId;
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleMoreClick = () => {
    if (isMyComment) {
      setIsActionMenuOpen(!isActionMenuOpen);
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
    setIsActionMenuOpen(false);
    setEditContent(comment.content);
    // textarea에 포커스
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setEditContent(comment.content);
  };

  const handleSave = async () => {
    try {
      await updateComment({
        commentId: comment.id,
        content: editContent
      });
      setIsEditMode(false);
      // 댓글 목록 새로고침
      onCommentUpdate?.();
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      // TODO: 에러 처리 (토스트 메시지 등)
    }
  };

  const handleDelete = async () => {
    if (!confirm("댓글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deleteComment(comment.id);
      setIsActionMenuOpen(false);
      // 댓글 목록 새로고침
      onCommentUpdate?.();
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      // TODO: 에러 처리 (토스트 메시지 등)
    }
  };

  return (
    <div
      className={`${isEditMode ? "pt-[24px] pb-0 border-b-0" : "py-[24px] border-b border-gray-100"}`}
    >
      <div className="flex flex-col gap-[10px]">
        {/* 첫 번째 요소: 닉네임, 작성일, 더보기 아이콘 */}
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
                className="cursor-pointer"
                onClick={handleMoreClick}
              />
              {isActionMenuOpen && (
                <ActionMenu onEdit={handleEdit} onDelete={handleDelete} />
              )}
            </div>
          )}
        </div>

        {/* 두 번째 요소: 댓글 내용 또는 수정 모드 */}
        {isEditMode ? (
          <div className="flex flex-col gap-[10px]">
            <Textarea
              ref={textareaRef}
              value={editContent}
              onChange={setEditContent}
              placeholder="댓글을 수정해주세요"
              className="h-[120px]"
            />
            <div className="flex justify-end gap-[12px]">
              <Button variant="secondary" onClick={handleCancel}>
                취소
              </Button>
              <Button variant="primary" onClick={handleSave}>
                등록
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
