import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useAuthStore } from "@/state/useAuthStore";
import { Input } from "../components/ui/input";

const formSchema = z.object({
  email: z.email().min(1),
  password: z.string().min(8),
});

export default function Login() {
const [loginAs, setLoginAs] = useState<"Admin" | "Doctor">("Admin")

  const navigate = useNavigate();

  const { setRole } = useAuthStore();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await api.post(loginAs === "Admin" ? "admin/login" : "doctor/login", {
        json: value,
      });
      setRole(loginAs);
      toast.success(`${loginAs} logged in successfully`);
      navigate(loginAs === "Admin" ? "/admin-dashboard" : "/doctor-dashboard");
    },
    validators: {
      onSubmit: formSchema,
    },
  });

  return (
    <div className="flex h-full items-center justify-center">
      <Card className="max-w-sm min-w-sm h-fit">
        <CardHeader>
          <CardTitle className="text-2xl">{loginAs} Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className="space-y-4">
              <form.Field name="email">
                {(field) => {
                  const { errors } = field.state.meta;
                  return (
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="JohnDoe@example.com"
                        type="text"
                      />
                      {errors.length > 0 && (
                        <span className="text-destructive">
                          {errors[0]?.message}
                        </span>
                      )}
                    </div>
                  );
                }}
              </form.Field>

              <form.Field name="password">
                {(field) => {
                  const { errors } = field.state.meta;
                  return (
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {errors.length > 0 && (
                        <span className="text-destructive">
                          {errors[0]?.message}
                        </span>
                      )}
                    </div>
                  );
                }}
              </form.Field>
              <Button type="submit" className="w-full">
                Login
              </Button>
              {loginAs === "Admin" ? (
                <p>
                  Doctor Login?{" "}
                  <Button
                    variant={"link"}
                    onClick={() => setLoginAs("Doctor")}
                    type="button"
                  >
                    Click here
                  </Button>
                </p>
              ) : (
                <p>
                  Admin Login?{" "}
                  <Button
                    variant={"link"}
                    onClick={() => setLoginAs("Admin")}
                    type="button"
                  >
                    Click here
                  </Button>
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
