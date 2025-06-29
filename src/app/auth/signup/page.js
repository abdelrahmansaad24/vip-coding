import AuthForm from '@/components/AuthForm'

export default function SignUpPage() {
  return (
    <div className="gradient-bg min-h-screen py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-3xl">👋</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600">
            Join thousands of home chefs managing their recipes
          </p>
        </div>
        <AuthForm mode="signup" />
      </div>
    </div>
  )
} 