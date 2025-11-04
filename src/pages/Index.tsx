import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="mb-4 text-4xl font-bold">Manipal University Jaipur</h1>
        <p className="text-xl text-muted-foreground">INSPIRED BY LIFE</p>
        <Button 
          onClick={() => navigate("/login")}
          size="lg"
          className="bg-primary hover:bg-primary/90"
        >
          Go to Portal Login
        </Button>
      </div>
    </div>
  );
};

export default Index;
