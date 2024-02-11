const Footer = () => {
  return (
      <footer className="bg-customPurple2 text-white py-12">
          <div className="container mx-auto px-4 md:px-0 flex flex-col h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                  <div>
                      <h3 className="text-xl font-bold mb-4">About Us</h3>
                      <p className="text-gray-300">We provide the healthy bun for you.</p>
                  </div>
                  <div>
                      <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                      <p className="text-gray-300">Indonesia</p>
                      <p className="text-gray-300">Email: info@example.com</p>
                      <p className="text-gray-300">Phone: 123-456-7890</p>
                  </div>
              </div>
              <div className="text-center mt-8">
                  <p className="text-gray-300">&copy; 2024 BF Bakery. All rights reserved.</p>
              </div>
          </div>
      </footer>
  );
}

export default Footer;
