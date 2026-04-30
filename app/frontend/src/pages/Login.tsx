import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"

export default function Login() {
    const [state, setState] = useState<'Sign Up' | 'Login'>('Sign Up')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const navigate = useNavigate()

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            if (state === 'Sign Up') {
                await api.post(`user/register`, {
                    json: { name, email, password },
                })
            } else {
                await api.post(`user/login`, {
                    json: { email, password },
                })
            }
        },
        onSuccess: () => {
            toast.success(state === 'Sign Up' ? "Account created successfully" : "Logged in successfully")
            navigate('/')
        },
        onError: (error) => {
            console.log({error})
            toast.error(error.message)
        }
    })

    const onSubmitHandler = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        mutate()
    }


    return (
        <form onSubmit={onSubmitHandler} className="flex w-full justify-center mt-20">
            <Card className="max-w-sm w-full">
                <CardHeader>
                    <CardTitle>{state === 'Sign Up' ? "Create Account" : "Login"}</CardTitle>
                    <CardDescription>
                        Please {state === 'Sign Up' ? "create an account" : "login"} to book appointments
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-2">
                    {state === 'Sign Up' && (
                        <div className="grid gap-2">
                            <Label>Full Name</Label>
                            <Input
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label>Email</Label>
                        <Input
                            type="email"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Password</Label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-2">
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Please wait..." : state === 'Sign Up' ? "Create Account" : "Login"}
                    </Button>
                    <Button
                        type="button"
                        variant="link"
                        onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}
                    >
                        {state === 'Sign Up' ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}