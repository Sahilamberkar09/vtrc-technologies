import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import CustomCursor from "./components/ui/CustomCursor";
import LoadingScreen from "./components/common/LoadingScreen";
import AnimatedRoutes from "./components/common/AnimatedRoutes";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <Router>
      <CustomCursor />
      <Navbar />
      <main>
        <AnimatedRoutes />
      </main>
      <Footer />
    </Router>
  );
}

export default App;
