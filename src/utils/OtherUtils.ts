import { UploadService, UploadType } from "@/services/upload.service";
import { Dayjs } from "dayjs";

const IMAGE_EXTENSIONS = ["gif", "jpg", "jpeg", "png", "svg", "webp"];

export function validateEmail(email: string) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

export function fileIsImage(fileName: string): boolean {
  const extension = getFileExtension(fileName);
  return IMAGE_EXTENSIONS.includes(extension);
}

function getFileExtension(fileName: string): string {
  return fileName.split(".")[1] || '';
}

export function getUserAvatar(avatar: string | undefined, role?: "TEACHER" | "STUDENT" | "CHIEF_TEACHER"): string {
  if (!avatar) {
    return role !== "STUDENT" ? "/imgs/default-teacher-avatar.png" : "/imgs/default-student-avatar.png";
  }
  return UploadService.getImageURL(UploadType.AVATAR, avatar);
}


export function dayjsTimeToMs(dayjs: Dayjs | null): number {
  if (!dayjs) {
    return 0;
  }

  let seconds = dayjs.second() + dayjs.minute() * 60 + dayjs.hour() * 3600;

  return seconds * 1000;
}

export const handleDownload = (url: string) => {
  console.log(url.split('/').pop()!)
  const a = document.createElement('a')
  a.href = url
  a.download = url.split('/').pop()!
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
};