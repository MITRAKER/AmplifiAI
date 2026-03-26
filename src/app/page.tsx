import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: "🏘️",
      title: "Connect",
      description: "Meet your neighbors and build meaningful relationships",
    },
    {
      icon: "📢",
      title: "Communicate",
      description: "Share updates, news, and important information instantly",
    },
    {
      icon: "🎉",
      title: "Celebrate",
      description: "Organize and join community events and block parties",
    },
    {
      icon: "🤝",
      title: "Collaborate",
      description: "Work together on neighborhood initiatives and projects",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-blue-200">AMPLIFI.AI</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Your hyperlocal neighborhood platform for connection and community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/directory"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Explore Directory
            </Link>
            <Link
              href="/block-party"
              className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors border border-white"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose AMPLIFI.AI?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Join Your Neighborhood Today
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Sign up or log in to connect with your neighbors and make your
            community stronger
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
            >
              Sign Up
            </Link>
            <Link
              href="/auth/login"
              className="bg-gray-200 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors inline-block"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-16 px-4"></main>
    </div>
  );
}
