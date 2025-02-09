import { useRef } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function Signup() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const firstnameRef = useRef<HTMLInputElement>(null);
  const lastnameRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function signup() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    const firstname = firstnameRef.current?.value;
    const lastname = lastnameRef.current?.value;
    const data = JSON.stringify({ username, password, firstname, lastname });

    try {
      const response = await axios.post(BACKEND_URL + "/api/v1/signup", data, {
        headers: {
          "Content-Type": "application/json",
          "Content-Length": data.length.toString(),
        },
      });
      console.log("Signup response:", response);
      navigate("/signin");
      alert("You have signed up!");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed. Please try again.");
    }
  }

  return (
    <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
      <div className="bg-white rounded-xl border min-w-48 p-8">
        <Input reference={lastnameRef} placeholder="Firstname" />
        <Input reference={firstnameRef} placeholder="Lastname" />
        <Input reference={usernameRef} placeholder="Username" />
        <Input reference={passwordRef} placeholder="Password" />
        <div className="flex justify-center pt-4">
          <Button
            onClick={signup}
            loading={false}
            variant="primary"
            text="Signup"
            fullWidth={true}
          />
        </div>
      </div>
    </div>
  );
}
