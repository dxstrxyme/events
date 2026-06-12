import { useAuthStore } from "@/stores/auth-store";
import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthFormCard } from "./auth-form-card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { AuthFormErrorAlert } from "./auth-form-error-alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
    const navigate = useNavigate();
    const register = useAuthStore(s => s.register);
    const authError = useAuthStore(s => s.authError);
    const isAuthLoading = useAuthStore(s => s.isAuthLoading);

    const [clientError, setClientError] = useState<string | null>(null);

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setClientError(null);

        const form = event.currentTarget;
        const formData = new FormData(form);
        const name = String(formData.get('name') ?? '').trim()
        const email = String(formData.get('email') ?? '').trim()
        const password = String(formData.get('password') ?? '').trim()
        const confirmPassword = String(formData.get('confirm-password') ?? '').trim()

        if (password !== confirmPassword) {
            setClientError("The passwords don't match")
            return
        }

        if (password.length < 8) {
            setClientError('Password must be at least 8 characters long!')
            return
        }

        if (name.length < 2) {
            setClientError(' Name must be at least 2 characters long.')
            return
        }

        try {
            await register({ email, password, name })
        } catch {

        }
    }

    const topError = clientError ?? authError

    return (
        <div className="flex w-full max-w-sm flex-col gap-6">
            <AuthFormCard title="Registration">
                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        <AuthFormErrorAlert message={topError} />
                        <Field>
                            <FieldLabel htmlFor="register-name">name</FieldLabel>
                            <Input
                                id="register-name"
                                name="name"
                                type="text"
                                placeholder="Ivan Ivanov"
                                autoComplete="name"
                                required
                                minLength={2}
                                maxLength={100}
                                disabled={isAuthLoading} />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="register-email">email</FieldLabel>
                            <Input
                                id="register-email"
                                name="email"
                                type="email"
                                placeholder="example@gmail.com"
                                autoComplete="email"
                                required
                                disabled={isAuthLoading} />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="register-password">password</FieldLabel>
                            <Input
                                id="register-password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                disabled={isAuthLoading} />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="register-confirm-password">repeat password</FieldLabel>
                            <Input
                                id="register-confirm-password"
                                name="confirm-password"
                                type="password"
                                autoComplete="new-password"
                                required
                                disabled={isAuthLoading} />
                        </Field>
                        <Field>
                            <Button type="submit"
                                className="w-full"
                                disabled={isAuthLoading}
                            >{isAuthLoading ? 'Creating...' : 'Create account'}
                            </Button>
                            <FieldDescription className="text-center">
                                Already have an account?{' '}
                                <Link
                                    className="underline-offset-4 hover:underline"
                                    to="/login"
                                    onClick={() => {
                                        useAuthStore.getState().clearAuthError();
                                        setClientError(null)
                                    }}
                                >
                                    login
                                </Link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </AuthFormCard>
        </div>
    )


}