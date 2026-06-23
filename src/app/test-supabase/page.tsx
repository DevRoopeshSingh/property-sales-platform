import { createClient } from '@/utils/supabase/server'

export default async function Page() {
  const supabase = await createClient()

  const { data: todos } = await supabase.from('todos').select()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Test Page</h1>
      <ul>
        {todos?.map((todo) => (
          <li key={todo.id} className="mb-2 list-disc ml-6">{todo.name}</li>
        ))}
      </ul>
      {(!todos || todos.length === 0) && (
        <p className="text-gray-500">No todos found or Supabase table does not exist.</p>
      )}
    </div>
  )
}
