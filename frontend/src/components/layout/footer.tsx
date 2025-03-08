export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Finance Cloud. All rights
            reserved.
          </p>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
            Terms of Service
          </a>
          <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
}
