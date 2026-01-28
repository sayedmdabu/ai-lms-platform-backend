export interface User {
  id: string
  email: string
  username: string
  full_name?: string
  role: 'student' | 'instructor' | 'admin'
}

export interface Course {
  id: string
  title: string
  description: string
  instructor_id: string
  price: number
  thumbnail_url?: string
}
