"use client";

import { useState } from "react";
import clsx from "clsx";

const teamMember = [
  "정상현",
  "이찬재",
  "김용신",
  "권태완",
  "황수보",
  "최민지",
  "신준",
  "정광필",
  "신준영",
  "오예환",
];

type STATUS = "success" | "fail" | null;

type CONNECT_INFO = {
  title?: string;
  description?: string;
  imageUrl?: string;
};
interface PostDataType {
  body?: string;
  connectColor?: string;
  connectInfo?: CONNECT_INFO[];
}

export default function SelectMember() {
  const [members, setMembers] = useState<string[]>([]);
  const [restaurantName, setRestaurantName] = useState<string>("");
  const [otherTeam, setOtherTeam] = useState<string>("");
  const [status, setStatus] = useState<STATUS>(null);

  const postData = async (data: PostDataType) => {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.tosslab.jandi-v2+json",
      },
      body: JSON.stringify(data),
    });
    return response;
  };

  const isAvailable = () => {
    return members.length > 0 && restaurantName.length > 0;
  };

  const handleClickMember = (member: string) => {
    if (members.includes(member)) {
      setMembers((prev) => {
        return prev.filter((i) => i !== member);
      });
    } else {
      setMembers((prev) => {
        return [...prev, member];
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRestaurantName(e.target.value);
  };

  const handleChangeOptional = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherTeam(e.target.value);
  };

  const makeBodyString = () => {
    const curDate = new Date();
    const month = curDate.getMonth() + 1;
    const date = curDate.getDate();
    const hour = curDate.getHours() >= 18 ? "저녁" : "점심";
    return `${month}월 ${date}일 / ${hour} / ${restaurantName}`;
  };

  const handleClickSubmit = async () => {
    if (!isAvailable()) return;

    const memberList = members.join(" ");
    const data = {
      title: makeBodyString(),
      body: `${memberList} ${otherTeam}`,
    };

    try {
      const res = await postData(data);
      if (res.status === 200) setStatus("success");
      else setStatus("fail");
    } catch (error) {
      setStatus("fail");
    } finally {
      setMembers([]);
      setRestaurantName("");
      setOtherTeam("");
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-y-10 items-center p-12">
      <div>일용할 양식</div>

      <ul className="w-full h-full grid grid-cols-2 gap-x-5  gap-y-5">
        {teamMember.map((i) => {
          return (
            <li
              className={clsx(
                "flex items-center justify-center w-full h-12 rounded-lg bg-gray-500 text-slate-50",
                {
                  "bg-green-500": members.includes(i),
                }
              )}
              key={i}
              onClick={() => handleClickMember(i)}
            >
              {i}
            </li>
          );
        })}
      </ul>

      <div className="w-full h-12 flex items-center gap-x-5 border-emerald-400">
        <label htmlFor="food" className="flex-2">
          식당
        </label>
        <input
          type="text"
          value={restaurantName}
          id="food"
          spellCheck={false}
          className="h-full flex-1 border-2 active:border-emerald-400 focus:border-emerald-400 outline-none"
          onChange={handleChange}
        />
      </div>

      <div className="w-full h-12 flex items-center gap-x-5 border-emerald-400">
        <label htmlFor="member" className="flex-2">
          다른 팀(Optional)
        </label>
        <input
          type="text"
          value={otherTeam}
          id="member"
          spellCheck={false}
          className="h-full flex-1 border-2 active:border-emerald-400 focus:border-emerald-400 outline-none"
          onChange={handleChangeOptional}
        />
      </div>

      <button
        className={clsx("w-full h-12 bg-gray-200 text-white rounded-lg", {
          "bg-green-400 text-slate-50": isAvailable(),
        })}
        onClick={handleClickSubmit}
      >
        제출
      </button>
      {status && (
        <div
          className={clsx("w-full flex items-center justify-center", {
            "text-green-500": status === "success",
            "text-red-500": status === "fail",
          })}
        >
          {status === "success" ? "입력 되었습니다. 🎉" : "오류 발생 👺"}
        </div>
      )}
    </div>
  );
}
