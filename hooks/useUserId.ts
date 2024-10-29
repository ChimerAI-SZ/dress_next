import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const useUserId = () => {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    let storedUserId = localStorage.getItem("userid");

    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = uuidv4();
      localStorage.setItem("userid", newUserId);
      setUserId(newUserId);
    }
  }, []);

  return userId;
};

export default useUserId;
