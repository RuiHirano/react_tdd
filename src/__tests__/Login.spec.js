import React from 'react';
import Login from '../views/Login'
import { render, screen, fireEvent, getByLabelText, queryByRole } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Login Page', () => {

    it('Loginコンポーネントのレンダリング', () => {
        render(<Login />);
        //screen.debug()
    })


    describe('Login Button', () => {
        it('Loginボタンが存在する', () => {
            const { getByRole } = render(<Login />);
            expect(getByRole("button", { name: "ログイン" })).toBeInTheDocument();
        })

        it('初期時、Loginボタンをクリックできないようにする', () => {
            const { getByRole } = render(<Login />);
            const button = getByRole("button", { name: "ログイン" })
            expect(button).toBeDisabled();
        })

        it('Loginボタンをクリックした場合のみdialogが表示される', () => {
            const { getByRole, queryByText, getByText, getByTestId } = render(<Login />);
            const button = getByRole("button", { name: "ログイン" })
            const emailInput = getByTestId("emailField")
            userEvent.type(emailInput, "test@test.com")  // 正しいemail入力
            const passwordInput = getByTestId("passwordField")
            userEvent.type(passwordInput, "testuser")   // 正しいpassword入力
            expect(queryByText("ログインしました")).toBeNull();
            userEvent.click(button)
            expect(getByText("ログインしました")).toBeInTheDocument();
        })

        it('dialogにEmailが表示される', () => {
            const { getByRole, queryByText, getByText, getByTestId } = render(<Login />);
            const button = getByRole("button", { name: "ログイン" })
            const emailInput = getByTestId("emailField")
            userEvent.type(emailInput, "test@test.com")  // 正しいemail入力
            const passwordInput = getByTestId("passwordField")
            userEvent.type(passwordInput, "testuser")   // 正しいpassword入力
            userEvent.click(button)
            expect(queryByText("Email: test@test.com")).toBeInTheDocument();
        })

        it('errorsがある場合、Loginボタンをクリックできないようにする', () => {
            const { getByRole, getByTestId } = render(<Login />);
            const emailInput = getByTestId("emailField")
            userEvent.type(emailInput, "test")
            const button = getByRole("button", { name: "ログイン" })
            expect(button).toBeDisabled();
        })

        /*it('Loginボタンをcloseするとdialogが消える', () => {
            const { getByRole, queryByText, getByText, container } = render(<Login />);
            const button = getByRole("button", { name: "ログイン" })
            userEvent.click(button)
            expect(queryByText("ログインしました")).toBeInTheDocument();
            const dialog = getByRole("presentation")
            userEvent.click(dialog, { clientX: 20, clientY: 20 })
            screen.debug()
            expect(queryByText("ログインしました")).toBeNull();
        })*/
    })

    describe('Email Field', () => {
        it('Emailラベルが存在する', () => {
            const { getByText } = render(<Login />);
            expect(getByText("Email", { selector: "p" })).toBeInTheDocument();
        })

        it('Emailテキストフィールドが存在する', () => {
            const { getByTestId } = render(<Login />);
            expect(getByTestId("emailField")).toBeInTheDocument();
        })

        it('Emailテキストフィールドに初期値ではhelperTextが表示されない', () => {
            const { queryByText } = render(<Login />);
            expect(queryByText("Emailを入力してください")).toBeNull();
        })

        it('Emailテキストフィールドに正しいemailを記入しなかった場合のみ"Emailを入力してください"が表示される', () => {
            const { getByTestId, getByText, queryByText } = render(<Login />);
            const emailInput = getByTestId("emailField")
            userEvent.type(emailInput, "test")
            expect(queryByText("Emailを入力してください")).toBeInTheDocument();
            userEvent.type(emailInput, "test@test.com")
            expect(queryByText("Emailを入力してください")).toBeNull();
        })

        it('Emailテキストフィールドが30文字以上の場合のみ”Emailが長すぎます”が表示される', () => {
            const { getByTestId, getByText, queryByText } = render(<Login />);
            const emailInput = getByTestId("emailField")
            userEvent.type(emailInput, "thisistoolongemail@testaddresstest.com")
            expect(queryByText("Emailが長すぎます")).toBeInTheDocument();
            userEvent.type(emailInput, "thisis@test.com")
            expect(queryByText("Emailが長すぎます")).toBeNull();
        })

    })


    describe('Password Field', () => {

        it('Passwordラベルが存在する', () => {
            const { getByText } = render(<Login />);
            expect(getByText("Password", { selector: "p" })).toBeInTheDocument();
        })

        it('Passwordテキストフィールドが存在する', () => {
            const { getByTestId } = render(<Login />);
            expect(getByTestId("passwordField")).toBeInTheDocument();
        })

        it('Passwordテキストフィールドに初期値ではhelperTextが表示されない', () => {
            const { queryByText } = render(<Login />);
            expect(queryByText("Passwordを入力してください")).toBeNull();
        })

        it('Passwordテキストフィールドが8文字未満の場合のみ”パスワードが短すぎます”と表示される', () => {
            const { getByTestId, queryByText } = render(<Login />);
            const passwordInput = getByTestId("passwordField")
            userEvent.type(passwordInput, "test")
            expect(queryByText("パスワードが短すぎます")).toBeInTheDocument();
            userEvent.type(passwordInput, "testuser")
            expect(queryByText("パスワードが短すぎます")).toBeNull();
        })
    })
});