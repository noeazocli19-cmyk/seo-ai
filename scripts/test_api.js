(async () => {
  try {
    const chatRes = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Test message to check Gemini error' }] }),
    })
    console.log('\n--- /api/chat ---')
    console.log('status:', chatRes.status)
    console.log(await chatRes.text())

    const genRes = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'article', params: { keyword: 'test IA', language: 'français', tone: 'professionnel', length: 'court' } }),
    })
    console.log('\n--- /api/generate ---')
    console.log('status:', genRes.status)
    console.log(await genRes.text())
  } catch (err) {
    console.error('Request error:', err)
    process.exit(1)
  }
})()
