import React, { useCallback, useState } from 'react';
import { TextField, Button, Typography, Modal, Dialog, DialogTitle } from "@material-ui/core"

interface Props {
    label: string,
    id: string,
    placeholder?: string
    value: string
    setValue: (inputText: string) => void
    errorMessage: string | undefined
}

const LabelInput: React.FC<Props> = ({ id, label, placeholder, value, setValue, errorMessage }) => {
    return (
        <div>
            <Typography>{label}</Typography>
            <TextField
                inputProps={{ "data-testid": id }}
                placeholder={placeholder}
                helperText={errorMessage}
                value={value}
                onChange={(e) => { setValue(e.target.value) }}
            />
        </div>
    )
}

const useEmailInput = () => {
    const [errors, setErrors] = useState<{ invalid: undefined | string }>({ invalid: "" })
    const [value, setValue] = useState<string>("")

    const checkValidation = (text: string) => {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const isEmail = regex.test(text);
        if (!isEmail) {
            setErrors({ invalid: "Emailを入力してください" })
        } else if (text.length > 30) {
            setErrors({ invalid: "Emailが長すぎます" })
        } else {
            setErrors({ invalid: undefined })
        }
    }
    const setInputValue = (inputText: string) => {
        checkValidation(inputText)
        setValue(inputText)
    }

    const renderEmailInput = useCallback(() => {
        return (
            <LabelInput id="emailField" label="Email" placeholder="ex@example.com" value={value} setValue={setInputValue} errorMessage={errors.invalid} />
        )
    }, [value, errors])

    return { "renderEmailInput": renderEmailInput, "errors": errors, "email": value }
}

const usePasswordInput = () => {
    const [errors, setErrors] = useState<{ invalid: undefined | string }>({ invalid: "" })
    const [value, setValue] = useState<string>("")

    const checkValidation = (text: string) => {
        if (text.length < 8) {
            setErrors({ invalid: "パスワードが短すぎます" })
        } else {
            setErrors({ invalid: undefined })
        }
    }

    const setInputValue = (inputText: string) => {
        checkValidation(inputText)
        setValue(inputText)
    }

    const renderPasswordInput = useCallback(() => {
        return (
            <LabelInput id="passwordField" label="Password" value={value} setValue={setInputValue} errorMessage={errors.invalid} />
        )
    }, [value, errors])

    return { "renderPasswordInput": renderPasswordInput, "errors": errors, "password": value }
}

const Login: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false)
    const { renderPasswordInput, errors: pwErrors, password } = usePasswordInput()
    const { renderEmailInput, errors: emErrors, email } = useEmailInput()
    return (
        <div>
            {renderEmailInput()}
            {renderPasswordInput()}

            <Button disabled={!(pwErrors.invalid === undefined && emErrors.invalid === undefined)} onClick={() => setOpen(true)}>ログイン</Button>
            <Dialog onClose={() => setOpen(false)} open={open}>
                <DialogTitle>ログインしました</DialogTitle>
                <DialogTitle>{`Email: ${email}`}</DialogTitle>
            </Dialog>
        </div>
    )

}

export default Login