import pb from '@/lib/pocketbase/client'
import { streamAgentChat, displayableMessages } from '@/lib/skipAi'

export const iaChatStream = async (
  message: string,
  conversationId: string | null,
  signal: AbortSignal,
  onChunk: (delta: string, full: string) => void,
) => {
  const res = await fetch(`${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/ia/chat-stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: pb.authStore.token },
    body: JSON.stringify({ message, conversation_id: conversationId }),
    signal,
  })
  const result = await streamAgentChat(res, { onChunk, signal })
  return {
    conversationId: res.headers.get('X-Conversation-Id') ?? result.conversation_id,
    content: result.content,
    messageId: result.message_id,
  }
}

export const iaListChats = async (limit = 20) => {
  const res = await fetch(
    `${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/ia/chats?limit=${limit}`,
    {
      headers: { Authorization: pb.authStore.token },
    },
  )
  return res.json()
}

export const iaListMessages = async (conversationId: string) => {
  const res = await fetch(
    `${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/ia/chats/${conversationId}/messages`,
    { headers: { Authorization: pb.authStore.token } },
  )
  const data = await res.json()
  return displayableMessages(data.messages || [])
}
