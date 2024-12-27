import React from "react";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch
import { login } from "../../redux/actions/authActions"; // Import the login action
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Index() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const onSubmit = (values, { setSubmitting }) => {
    dispatch(login(values.email, values.password))
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
                <h2 className="log-title">Login</h2>
                <p>
                  Need an account?{" "}
                  <a href="/register" title="">
                    Sign Up
                  </a>
                </p>
                <Formik
                  initialValues={{ email: "", password: "" }}
                  validate={(values) => {
                    const errors = {};
                    if (!values.email) {
                      errors.email = "Required";
                    } else if (
                      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                        values.email
                      )
                    ) {
                      errors.email = "Invalid email address";
                    }
                    return errors;
                  }}
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

                      <a href="/" title="" className="forgot-pwd">
                        Forgot Password?
                      </a>
                      <div className="submit-btns">
                        <button className="mtr-btn signin" type="submit" disabled={loading}>
                          <span>Login</span>
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
