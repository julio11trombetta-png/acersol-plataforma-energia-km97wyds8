routerAdd(
  'POST',
  '/backend/v1/ia/chat-stream',
  (e) => {
    var body = e.requestInfo().body || {}
    var userId = e.auth ? e.auth.id : ''
    if (!userId) return e.unauthorizedError('auth required')
    if (!body.message || !body.message.trim()) return e.badRequestError('message is required')

    var conv = $ai.agent('acersol-expert').getOrCreateConversation({
      user_id: userId,
      id: body.conversation_id || null,
    })
    var iter = $ai.agent('acersol-expert').chat({
      user_id: userId,
      conversation_id: conv.id,
      message: body.message,
      stream: true,
    })
    e.response.header().set('Content-Type', 'text/event-stream')
    e.response.header().set('Cache-Control', 'no-cache')
    e.response.header().set('X-Conversation-Id', conv.id)
    $response.stream(e, iter)
  },
  $apis.requireAuth(),
)
