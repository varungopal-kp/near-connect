import React from "react";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../redux/actions/authActions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerSchema } from "../../validations/authSchema";
import { validator } from "../../helpers/validator";

export default function Index() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const onSubmit = (values, { setSubmitting }) => {
    const formData ={
        email: values.email,
        password: values.password,
        name: values.name,
        username: values.username
    }
    dispatch(signup(formData))
      .then(() => {
        navigate("/");
        toast.success("Login Successful!");
      })
      .catch((err) => {
        console.error(err);
        toast.error(err || "Login Failed");
        setSubmitting(false);
      });
  };

  return (
    <div className="theme-layout">
      <div className="container-fluid pdng0">
        <div className="row merged">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="login-reg-bg">
              <div className="log-reg-area sign">
                <h2 className="log-title">Resgister</h2>
                <p>
                  Have an account?{" "}
                  <a href="/login" title="">
                    Sign In
                  </a>
                </p>
                <Formik
                  initialValues={{
                    email: "",
                    password: "",
                    name: "",
                    username: "",
                    confirmPassword: "",
                  }}
                  validate={validator(registerSchema)}
                  onSubmit={onSubmit}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <input
                          type="text"
                          name="name"
                          required="required"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                        />

                        <label className="control-label" htmlFor="input">
                          Name
                        </label>
                        <i className="mtrl-select"></i>
                        <div className="error">
                          {errors.name && touched.name && errors.name}
                        </div>
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          name="username"
                          required="required"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.username}
                        />

                        <label className="control-label" htmlFor="input">
                          Username
                        </label>
                        <i className="mtrl-select"></i>
                        <div className="error">
                          {errors.username &&
                            touched.username &&
                            errors.username}
                        </div>
                      </div>
                      <div className="form-group">
                        <input
                          type="email"
                          name="email"
                          required="required"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.email}
                        />

                        <label className="control-label" htmlFor="input">
                          Email
                        </label>
                        <i className="mtrl-select"></i>
                        <div className="error">
                          {errors.email && touched.email && errors.email}
                        </div>
                      </div>
                      <div className="form-group">
                        <input
                          type="password"
                          name="password"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.password}
                        />
                        <label className="control-label" htmlFor="input">
                          Password
                        </label>
                        <i className="mtrl-select"></i>
                        <div className="error">
                          {errors.password &&
                            touched.password &&
                            errors.password}
                        </div>
                      </div>
                      <div className="form-group">
                        <input
                          type="password"
                          name="confirmPassword"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.confirmPassword}
                        />
                        <label className="control-label" htmlFor="input">
                          Confirm Password
                        </label>
                        <i className="mtrl-select"></i>
                        <div className="error">
                          {errors.confirmPassword &&
                            touched.confirmPassword &&
                            errors.confirmPassword}
                        </div>
                      </div>                      

                      <div className="submit-btns">
                        <button
                          className="mtr-btn signin"
                          type="submit"
                          disabled={loading}
                        >
                          <span>Register</span>
                        </button>
                      </div>
                    </form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
