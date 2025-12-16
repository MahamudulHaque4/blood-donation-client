import React from "react";
import { useForm } from "react-hook-form";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleRegistration = (data) => {
    console.log("after register", data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleRegistration)}>
        <fieldset className="fieldset">
          {/* Email */}
          <label className="label">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="input input-bordered w-full"
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}

          {/* Password */}
          <label className="label mt-3">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "true",
              minLength: { value: 6, message: "Password must be at least 6 characters long" },
              pattern: { value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/, message: "Password must contain at least one letter, one number, and one special character" },
            })}
            className="input input-bordered w-full"
            placeholder="Password"
          />
          {errors.password?.type === "required" && <p className="text-red-500">Password is required</p>}
          {errors.password?.type === "minLength" && <p className="text-red-500">{errors.password.message}</p>}
          {errors.password?.type === "pattern" && <p className="text-red-500">{errors.password.message}</p>}

          {/* Forgot Password */}
          <div className="mt-2">
            <a className="link link-hover">Forgot password?</a>
          </div>

          {/* Button */}
          <button type="submit" className="btn btn-neutral mt-4">
            Register
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default Register;
