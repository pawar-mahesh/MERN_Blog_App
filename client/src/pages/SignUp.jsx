import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  let isSignUpBtnDisabled = true;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const onChangeInput = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value.trim() });
  };

  if (formData.username && formData.email && formData.password) {
    isSignUpBtnDisabled = false;
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      setIsLoading(false);

      // success
      if (data.success === true) {
        navigate("/sign-in");
      }

      // failure
      else {
        setErrorMessage(data.message);
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="text-4xl font-bold dark:text-white">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              React's
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is a React Blog project. You can sign up with your email and
            password or with Google.
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={onSubmitHandler}>
            <div>
              <Label value="Username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={onChangeInput}
              />
            </div>
            <div>
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="Email"
                id="email"
                onChange={onChangeInput}
              />
            </div>
            <div>
              <Label value="Password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={onChangeInput}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={isSignUpBtnDisabled}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" /> <span className="pl-3">Loading...</span>
                </>
              ) : (
                "SignUp"
              )}
            </Button>
            {errorMessage && (
              <Alert className="mt-5" color="failure">
                {errorMessage}
              </Alert>
            )}
          </form>
          {/* sign in */}
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
