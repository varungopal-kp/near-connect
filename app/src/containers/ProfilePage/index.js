import { Field, Formik } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updateProfile } from "../../redux/actions/commonActions";
import { profileSchema } from "../../validations/profileSchema";
import { validator } from "../../helpers/validator";
import { UPDATE_PROFILE } from "../../redux/constants/common";

export default function Index() {
  const dispatch = useDispatch();

  const profileData = useSelector((state) => state.common?.profile);

  const [initialValues, setInitialValues] = React.useState({
    name: "",
    lastName: "",
    username: "",
    about: "",
    gender: "",
    year: "",
    month: "",
    day: "",
    pincode: "",
    place: "",
  });

  useEffect(() => {
    if (profileData?._id) {
      const dob = new Date(profileData.dob || new Date());
      const year = dob.getFullYear();
      const month = dob.getMonth() + 1;
      const day = dob.getDate();

      setInitialValues({
        name: profileData.name,
        username: profileData.username,
        lastName: profileData.lastName,
        about: profileData.about,
        gender: profileData.gender,
        pincode: profileData.pincode,
        place: profileData.place,
        year: year,
        month: month,
        day: day,
      });
    }
  }, [profileData]);

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    const dob = new Date(values.year, values.month - 1, values.day);

    const formdata = {
      name: values.name,
      lastName: values.lastName,
      about: values.about,
      gender: values.gender,
      pincode: values.pincode,
      place: values.place,
      dob: dob,
    };
    try {
      dispatch(updateProfile(formdata))
        .then((data) => {
          if (data.data) {
            dispatch({ type: UPDATE_PROFILE, payload: data.data });
            toast.success("Successfull");
          }
        })
        .catch((err) => {
          toast.error(err || "Failed");
          setSubmitting(false);
        });
    } catch (error) {
      console.log(error);
      return resetForm();
    }
  };

  const years = [];
  for (let i = 2000; i <= new Date().getFullYear(); i++) {
    years.push(i);
  }
  const days = [];
  for (let i = 1; i <= 31; i++) {
    days.push(i);
  }
  const months = Array.from({ length: 12 }, (_, index) => {
    return new Date(0, index).toLocaleString("default", { month: "long" });
  });

  return (
    <div class="col-lg-6">
      <div class="central-meta">
        <div class="editing-info">
          <h5 class="f-title">
            <i class="ti-info-alt"></i>Profile
          </h5>

          <Formik
            initialValues={initialValues}
            enableReinitialize
            validate={validator(profileSchema)}
            validateOnBlur
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
              <form onSubmit={handleSubmit} method="post">
                <div class="form-group half">
                  <Field name="name" type="text" required />
                  <label class="control-label" for="input">
                    First Name
                  </label>
                  <i class="mtrl-select"></i>
                </div>
                <div class="form-group half">
                  <Field name="lastName" type="text" required />
                  <label class="control-label" for="input">
                    Last Name
                  </label>
                  <i class="mtrl-select"></i>
                </div>

                <div class="dob">
                  <div class="form-group">
                    <Field as="select" name="day">
                      <option value="" selected disabled>
                        Day
                      </option>
                      {days.map((day) => (
                        <option>{day}</option>
                      ))}
                    </Field>
                  </div>
                  <div class="form-group">
                    <Field as="select" name="month">
                      <option value="" selected disabled>
                        Month
                      </option>
                      {months.map((month, i) => (
                        <option value={i + 1}>{month}</option>
                      ))}
                    </Field>
                  </div>
                  <div class="form-group">
                    <Field as="select" name="year">
                      <option value="" selected disabled>
                        Year
                      </option>
                      {years.map((year) => (
                        <option>{year}</option>
                      ))}
                    </Field>
                  </div>
                </div>
                <div class="form-radio">
                  <div class="radio">
                    <label>
                      <Field type="radio" name="gender" value="Male" />
                      Male
                    </label>
                  </div>
                  <div class="radio">
                    <label>
                      <Field type="radio" name="gender" value="Female" />
                      Female
                    </label>
                  </div>
                </div>
                <div class="form-group">
                  <Field name="place" type="text" />
                  <label class="control-label" for="input">
                    Place
                  </label>
                  <i class="mtrl-select"></i>
                </div>
                <div class="form-group">
                  <Field name="pincode" type="text" />
                  <label class="control-label" for="input">
                    Pincode
                  </label>
                  <i class="mtrl-select"></i>
                </div>
                <div class="form-group">
                  <Field
                    name="about"
                    as="textarea"
                    rows="4"
                    placeholder=""
                    required
                    className={
                      errors.about && touched.about ? "input-error" : ""
                    }
                  />
                  {console.log(errors)}
                  {errors.about && touched.about && (
                    <div className="error">{errors.about}</div>
                  )}
                  <label class="control-label" for="textarea">
                    About Me
                  </label>
                  <i class="mtrl-select"></i>
                </div>
                <div class="submit-btns">
                  <button
                    type="button"
                    class="mtr-btn"
                    style={{ marginRight: "10px" }}
                  >
                    <span>Cancel</span>
                  </button>
                  <button type="submit" class="mtr-btn">
                    <span>Update</span>
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
