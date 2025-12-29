import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CheckCircle, Users, Calendar, BarChart3,
  Zap, Shield, ArrowRight, Star, Menu, X, Briefcase
} from "lucide-react"
import { Link } from "react-router-dom"

export default function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const features = [
    { icon: Users, title: "Team Collaboration", description: "Work seamlessly with your team members in real-time with advanced collaboration tools." },
    { icon: Calendar, title: "Smart Scheduling", description: "Intelligent project scheduling with automated deadline tracking and milestone management." },
    { icon: BarChart3, title: "Advanced Analytics", description: "Get deep insights into project performance with comprehensive reporting and analytics." },
    { icon: Zap, title: "Lightning Fast", description: "Built for speed with modern technology stack ensuring smooth and responsive experience." },
    { icon: Shield, title: "Enterprise Security", description: "Bank-level security with end-to-end encryption to keep your data safe and secure." },
    { icon: CheckCircle, title: "Task Management", description: "Organize, prioritize, and track tasks with our intuitive task management system." }
  ]

  const testimonials = [
    {
      name: "Saurabh",
      role: "Project Manager",
      company: "TechCorp",
      content: "This platform has revolutionized how we manage projects. Our team productivity increased by 40%.",
      rating: 5
    },
    {
      name: "Shivansh",
      role: "Team Lead",
      company: "StartupXYZ",
      content: "The intuitive interface and powerful features make project management a breeze. Highly recommended!",
      rating: 5
    },
    {
      name: "Shubh",
      role: "Operations Director",
      company: "GlobalCorp",
      content: "Finally, a project management tool that actually works as promised. Game-changer for our organization.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <nav className="bg-white shadow sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-indigo-700">ProjectHub</span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <a href="#features" className="text-gray-600 hover:text-indigo-600">Features</a>
            <a href="#testimonials" className="text-gray-600 hover:text-indigo-600">Testimonials</a>
            <Link to="/signup">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Get Started</Button>
            </Link>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-2 bg-white border-t">
            <a href="#features" className="block text-sm text-gray-700 hover:text-indigo-600">Features</a>
            <a href="#testimonials" className="block text-sm text-gray-700 hover:text-indigo-600">Testimonials</a>
            <a href="#pricing" className="block text-sm text-gray-700 hover:text-indigo-600">Pricing</a>
            <Link to="/">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-2">Get Started</Button>
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-indigo-100 via-white to-purple-100 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl sm:text-6xl font-bold text-indigo-700 mb-6">
            Manage Projects Like Never Before
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline your workflow, boost team productivity, and deliver projects on time with our all-in-one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6">
                SignUp <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
            <Button size="lg" variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8 py-6">
              LogIn
            </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Everything You Need to Succeed</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Our toolset helps you manage projects effortlessly across teams and timelines.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-50 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 bg-indigo-100 rounded-md flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <CardTitle className="text-lg text-gray-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-indigo-50 text-center">
        <div className="container mx-auto px-4 grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-4xl font-bold text-indigo-700">10K+</h3>
            <p className="text-gray-600">Projects Completed</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-indigo-700">50K+</h3>
            <p className="text-gray-600">Happy Users</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-indigo-700">99.9%</h3>
            <p className="text-gray-600">Uptime Guarantee</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Loved by Teams Worldwide</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real stories from teams who rely on AgileHub.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} className="bg-gray-50 hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex mb-2 space-x-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="italic text-gray-700">"{t.content}"</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role} at {t.company}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-indigo-700 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">Join thousands of teams and simplify your project workflow today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-indigo-700 hover:bg-gray-100 px-8 py-6">
                Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-700 px-8 py-6">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-100 border-t">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-indigo-700">ProjectHub</span>
            </div>
            <p className="text-gray-600">The ultimate project management tool for modern teams.</p>
          </div>
          {/* {[
            { title: "Product", links: ["Features", "Pricing", "Security", "API"] },
            { title: "Company", links: ["About", "Careers", "Blog", "Contact"] },
            { title: "Support", links: ["Help Center", "Docs", "Community", "Status"] }
          ].map((section, idx) => (
            <div key={idx}>
              <h3 className="font-semibold mb-4 text-gray-700">{section.title}</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                {section.links.map((link, i) => (
                  <li key={i}><a href="#" className="hover:text-indigo-600">{link}</a></li>
                ))}
              </ul>
            </div>
          ))} */}
        </div>
        <div className="text-center text-gray-500 text-sm mt-10">
          © 2024 AgileHub. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
