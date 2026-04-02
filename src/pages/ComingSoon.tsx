import { Link } from "react-router-dom";
import { ROUTES } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import { MoveLeft, Rocket } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ComingSoon() {
  return (
    <Card className="flex flex-col items-center justify-center min-h-[400px] text-center p-12 border-dashed shadow-none selection:bg-black selection:text-white">
      <div className="h-12 w-12 rounded-md bg-zinc-100 flex items-center justify-center text-black mb-6">
        <Rocket className="h-6 w-6" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-black mb-2">
        Feature Coming Soon
      </h1>
      <p className="text-zinc-500 max-w-sm mx-auto mb-8 text-sm">
        We're working hard to bring this feature to your workspace. Stay tuned for updates!
      </p>
      <Link to={ROUTES.DASHBOARD}>
        <Button variant="outline" className="gap-2 border-zinc-200">
          <MoveLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </Button>
      </Link>
    </Card>
  );
}
