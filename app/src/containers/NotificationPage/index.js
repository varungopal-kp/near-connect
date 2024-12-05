import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserNotification,
  updateNotificationSeen,
} from "../../redux/actions/commonActions";
import { toast } from "react-toastify";
import moment from "moment";
import { UPDATE_DASHBOARD_COUNT } from "../../redux/constants/common";
import { deleteNotification } from "../../redux/actions/commonActions";
import ProfilePic from "../../components/ProfilePic";

export default function Index() {
  const dispatch = useDispatch();
  const [notification, setNotification] = React.useState([]);

  const common = useSelector((state) => state.common);

  useEffect(() => {
    dispatch(getUserNotification())
      .then((res) => {
        if (res.data) {
          setNotification(res.data);
        }
      })
      .catch((err) => {
        toast.error(err || "Something went wrong");
      });

    if (common.totalNotifications) {
      dispatch(updateNotificationSeen())
        .then((res) => {
          dispatch({ type: UPDATE_DASHBOARD_COUNT, payload: 0 });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const handleDelete = (id) => {
    dispatch(deleteNotification(id))
      .then((res) => {
        if (res.data) {
          setNotification(notification.filter((item) => item._id !== id));
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error(err || "Something went wrong");
      });
  };

  return (
    <div class="col-lg-6">
      <div class="central-meta">
        <div class="editing-interest">
          <h5 class="f-title">
            <i class="ti-bell"></i>Recent Notifications
          </h5>
          <div class="notification-box">
            <ul>
              {notification.map((item) => (
                <li key={item._id}>
                  <figure>
                    <ProfilePic url={item.pic} />
                  </figure>
                  <div class="notifi-meta">
                    <p>{item.message}</p>
                    <span>{moment(item.createdAt).fromNow() || ""}</span>
                  </div>
                  <i
                    class="del fa fa-close"
                    onClick={() => {
                      handleDelete(item._id);
                    }}
                  ></i>
                </li>
              ))}
              {notification.length === 0 && <li>No Notifications</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
