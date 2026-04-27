import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function Login() {
    const [state, setState] = useState<'Sign Up' | 'Login'>('Sign Up')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const onSubmitHandler = async (event: React.SubmitEvent<HTMLFormElement>
    ) => {
        event.preventDefault()
    }

    return (
        <form onSubmit={onSubmitHandler} className="flex w-full justify-center mt-20">
            <Card className="max-w-sm w-full">
                <CardHeader>
                    <CardTitle>
                        <p className="text-2xl font-bold">{state === 'Sign Up' ? "Create Account" : "Login"}</p>
                    </CardTitle>
                    <CardDescription>
                        <p>Please {state === 'Sign Up' ? "create an account" : "login"} to book appointments</p>
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-2">
                    {
                        state === 'Sign Up' &&
                        <div className="grid gap-2">
                            <p>Full Name</p>
                            <Input value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                    }
                    <div className="grid gap-2">
                        <p>Email</p>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="grid gap-2">
                        <p>Password</p>
                        <Input value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-2">
                    <Button type="submit" className="w-full py-4">{state === 'Sign Up' ? "Create Account" : "Login"}</Button>
                    <Button type="button" variant="link" onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}>{state === 'Sign Up' ? "Already have an account? Login" : "Don't have an account? Sign Up"}</Button>
                </CardFooter>
            </Card>
        </form >
    )
}