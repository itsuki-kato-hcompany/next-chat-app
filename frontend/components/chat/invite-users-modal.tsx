"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Check, Search, X } from "lucide-react";
import type { User } from "../../src/generated/types";

type InvitableUser = Pick<User, "id" | "name" | "email" | "profileImgPath">;

interface InviteUsersModalProps {
  channelId: number;
  children: React.ReactNode;
}

/**
 * チャンネルにユーザーを招待するモーダルコンポーネント
 * - 名前またはメールアドレスでユーザーを検索
 * - 複数ユーザーを選択して一括招待（最大10人）
 * - 選択済みユーザーはチップとして常に表示される
 */
export function InviteUsersModal({ channelId, children }: InviteUsersModalProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // 検索結果のユーザー一覧
  const [users, setUsers] = useState<InvitableUser[]>([]);
  // 選択済みユーザー（Mapでユーザー情報を保持し、検索ワード変更後も表示可能にする）
  const [selectedUsers, setSelectedUsers] = useState<Map<number, InvitableUser>>(new Map());
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(false);
  const [inviting, setInviting] = useState(false);
  // 招待実行後の結果表示用
  const [inviteResult, setInviteResult] = useState<{
    invitedUsers: InvitableUser[];
    alreadyMemberUsers: InvitableUser[];
  } | null>(null);

  // モーダルを閉じた時に全ステートをリセット
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setUsers([]);
      setSelectedUsers(new Map());
      setError(false);
      setInviteResult(null);
    }
  }, [open]);

  /**
   * 招待可能ユーザーをroute handler経由で検索
   * チャンネルに未参加かつ検索クエリに一致するユーザーを取得する
   */
  const searchUsers = useCallback(
    async (query: string) => {
      // 空文字の場合は検索しない
      if (query.length < 1) {
        setUsers([]);
        return;
      }

      setFetching(true);
      setError(false);
      try {
        const params = new URLSearchParams({
          channelId: String(channelId),
          query,
        });
        const res = await fetch(`/api/invitable-users?${params}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setUsers(data.users);
      } catch {
        setError(true);
      } finally {
        setFetching(false);
      }
    },
    [channelId]
  );

  // 検索入力のデバウンス（300ms）
  // 入力のたびにAPIを叩かないよう、最後の入力から300ms後に検索を実行
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, open, searchUsers]);

  /**
   * ユーザーの選択/選択解除を切り替える
   * 最大10人まで選択可能
   */
  const toggleUserSelection = (user: InvitableUser) => {
    setSelectedUsers((prev) => {
      const next = new Map(prev);
      if (next.has(user.id)) {
        next.delete(user.id);
      } else {
        if (next.size >= 10) return prev;
        next.set(user.id, user);
      }
      return next;
    });
  };

  /** 選択済みユーザーのチップからの削除 */
  const removeSelectedUser = (userId: number) => {
    setSelectedUsers((prev) => {
      const next = new Map(prev);
      next.delete(userId);
      return next;
    });
  };

  /**
   * 選択済みユーザーをチャンネルに招待する
   * route handler経由でinviteToChannel mutationを実行
   */
  const handleInvite = async () => {
    if (selectedUsers.size === 0) return;

    setInviting(true);
    setError(false);
    try {
      const res = await fetch("/api/invite-to-channel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelId,
          userIds: Array.from(selectedUsers.keys()),
        }),
      });
      if (!res.ok) throw new Error("Failed to invite");
      const data = await res.json();
      // 招待結果を表示（成功したユーザー / 既にメンバーだったユーザー）
      setInviteResult({
        invitedUsers: data.invitedUsers,
        alreadyMemberUsers: data.alreadyMemberUsers,
      });
      // 招待完了後にステートをクリア
      setSelectedUsers(new Map());
      setUsers([]);
      setSearchQuery("");
    } catch {
      setError(true);
    } finally {
      setInviting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>ユーザーを招待</DialogTitle>
        </DialogHeader>

        {/* 招待結果の表示 */}
        {inviteResult && (
          <div className="space-y-2">
            {inviteResult.invitedUsers.length > 0 && (
              <p className="text-sm text-green-600">
                {inviteResult.invitedUsers.map((u) => u.name).join("、")}{" "}
                を招待しました
              </p>
            )}
            {inviteResult.alreadyMemberUsers.length > 0 && (
              <p className="text-sm text-yellow-600">
                {inviteResult.alreadyMemberUsers.map((u) => u.name).join("、")}{" "}
                は既にメンバーです
              </p>
            )}
          </div>
        )}

        {/* ユーザー検索入力 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="名前またはメールで検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* 選択済みユーザーのチップ表示（検索ワードを変えても常に表示される） */}
        {selectedUsers.size > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {selectedUsers.size}人 選択中（最大10人）
            </p>
            <div className="flex flex-wrap gap-2">
              {Array.from(selectedUsers.values()).map((user) => (
                <span
                  key={user.id}
                  className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 text-sm"
                >
                  {user.name}
                  <button
                    type="button"
                    onClick={() => removeSelectedUser(user.id)}
                    className="text-blue-400 hover:text-blue-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 検索結果のユーザー一覧 */}
        <ScrollArea className="max-h-64">
          <div className="space-y-1">
            {fetching && (
              <p className="text-sm text-muted-foreground py-4 text-center">
                検索中...
              </p>
            )}
            {error && (
              <p className="text-sm text-red-500 py-4 text-center">
                ユーザーの検索に失敗しました
              </p>
            )}
            {!fetching &&
              !error &&
              searchQuery.length > 0 &&
              users.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  該当するユーザーが見つかりません
                </p>
              )}
            {users.map((user) => {
              const isSelected = selectedUsers.has(user.id);
              return (
                <div
                  key={user.id}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-slate-100 ${
                    isSelected ? "bg-blue-50 border border-blue-200" : ""
                  }`}
                  onClick={() => toggleUserSelection(user)}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.profileImgPath || undefined} />
                    <AvatarFallback className="text-xs">
                      {user.name
                        ? user.name.slice(0, 2).toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  {/* 選択済みの場合チェックマークを表示 */}
                  {isSelected && (
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* 招待実行ボタン */}
        <Button
          onClick={handleInvite}
          disabled={selectedUsers.size === 0 || inviting}
          className="w-full"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          {inviting
            ? "招待中..."
            : selectedUsers.size > 0
              ? `${selectedUsers.size}人を招待する`
              : "招待するユーザーを選択してください"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
