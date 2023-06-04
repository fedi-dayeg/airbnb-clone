'use client'
import axios from "axios";
import {AiFillGithub} from "react-icons/ai";
import {FcGoogle} from "react-icons/fc";
import {useCallback, useState} from "react";
import {FieldValue, SubmitHandler, useForm} from "react-hook-form";
import useRegisterModal from "@/app/hooks/UseRegisterModal";
import useLoginModal from "@/app/hooks/UseLoginModal";
import Modal from "@/app/components/modals/Modal";
import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/input";
import toast from "react-hot-toast";
import Button from "@/app/components/Button";
import {signIn} from "next-auth/react";


const RegisterModal = () => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        }
    } = useForm<FieldValue<any>>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValue<any>> = (data) => {
        setIsLoading(true);
        axios.post('/api/register', data)
            .then(() => {
                registerModal.onClose();
            })
            .catch((error) => {
                toast.error("Something Went Wrong    ")
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    const toggle = useCallback(() => {
        registerModal.onClose();
        loginModal.onOpen();
    }, [loginModal, registerModal]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Welcome to Airbnb" subTitle="Create an account!"/>
            <Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required/>

            <Input id="name" label="Name" disabled={isLoading} register={register} errors={errors} required/>

            <Input id="password" label="Password" type="password" disabled={isLoading} register={register}
                   errors={errors} required/>
        </div>
    )

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr/>
            <Button outline label="Continue with Google" icon={FcGoogle} onClick={() => signIn("google")}/>

            <Button outline label="Continue with Github" icon={AiFillGithub} onClick={() => signIn('github')}/>

            <div className="text-neutral-500 text-center mt-4 font-light">
                <div className="flex flex-row justify-center items-center gap-2">
                    <div>Already have an account ?</div>
                    <div onClick={toggle} className="text-neutral-800 cursor-pointer hover:underline">Log in</div>
                </div>
            </div>
        </div>
    )
    return (
        <Modal title="Register" isOpen={registerModal.isOpen} onClose={registerModal.onClose}
               onSubmit={handleSubmit(onSubmit)} actionLabel="Continue" disabled={isLoading} body={bodyContent}
               footer={footerContent}/>
    )
}

export default RegisterModal;