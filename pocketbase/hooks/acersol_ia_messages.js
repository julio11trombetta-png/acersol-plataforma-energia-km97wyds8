routerAdd(
  'GET',
  '/backend/v1/ia/chats/{conversationId}/messages',
  (e) => {
    try {
      var userId = e.auth ? e.auth.id : ''
      if (!userId) return e.unauthorizedError('auth required')
      return e.json(
        200,
        $ai.agent('acersol-expert').listMessages({
          conversation_id: e.request.pathValue('conversationId'),
          user_id: userId,
        }),
      )
    } catch (err) {
      if (err instanceof SkipAiAgentsError) {
        var s = err.status || 500
        return e.json(s, { error: s >= 500 ? 'falha ao buscar conversa' : err.message })
      }
      throw err
    }
  },
  $apis.requireAuth(),
)
