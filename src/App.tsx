import AppRoutes from "./routes";
import { ThemeProvider } from "./components/providers/ThemeProvider";

export default function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}
