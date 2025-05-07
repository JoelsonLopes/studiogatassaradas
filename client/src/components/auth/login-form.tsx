import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { loginMutation } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [, navigate] = useLocation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: LoginFormValues) {
    loginMutation.mutate(values, {
      onSuccess: () => {
        console.log("Redirecionando após login bem-sucedido");
        // Redirecionamento explícito após login bem-sucedido
        navigate("/");
      }
    });
  }

  return (
    <div>
      <div className="space-y-2 mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Entrar</h2>
        <p className="text-neutral-medium">
          Digite suas credenciais para acessar sua conta
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuário</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="seu.email@exemplo.com" 
                    {...field}
                    className="h-11"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={isVisible ? "text" : "password"}
                      placeholder="********"
                      {...field}
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-neutral-medium"
                      onClick={() => setIsVisible(!isVisible)}
                    >
                      {isVisible ? (
                        <i className="ri-eye-off-line"></i>
                      ) : (
                        <i className="ri-eye-line"></i>
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full h-11 mt-6" 
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <i className="ri-login-box-line mr-2"></i>
            )}
            Entrar
          </Button>
        </form>
      </Form>
    </div>
  );
}
