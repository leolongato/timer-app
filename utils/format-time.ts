const formatTime = (minutes: number, seconds: number) =>
  `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

export default formatTime;
