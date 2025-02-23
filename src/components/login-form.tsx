import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import React from "react";

interface LoginFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;  // Fonction pour gérer la soumission du formulaire
  nameValue: string;                      // Valeur du champ "name"
  passwordValue: string;                  // Valeur du champ "password"
  setName: (value: string) => void;       // Fonction pour mettre à jour le nom
  setPassword: (value: string) => void;   // Fonction pour mettre à jour le mot de passe
}

export function LoginForm({
                            onSubmit,
                            nameValue,
                            passwordValue,
                            setName,
                            setPassword,
                            ...props
                          }: LoginFormProps) {
  return (
      <div className={cn("flex flex-col gap-6")} {...props}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your name below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      required
                      value={nameValue}
                      onChange={(e) => setName(e.target.value)}  // Mise à jour du nom
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                      id="password"
                      type="password"
                      placeholder="My password"
                      required
                      value={passwordValue}
                      onChange={(e) => setPassword(e.target.value)}  // Mise à jour du mot de passe
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/register" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
  )
}
