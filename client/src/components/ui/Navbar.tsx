import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full p-4 bg-transparent text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">StudyHub</Link>
        <div className="flex space-x-4">
          <Link href="/" className="hover:text-pink-500 transition duration-200">Home</Link>
          <Link href="/login" className="hover:text-pink-500 transition duration-200">Login</Link>
          <Link href="/signup" className="hover:text-pink-500 transition duration-200">Signup</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;