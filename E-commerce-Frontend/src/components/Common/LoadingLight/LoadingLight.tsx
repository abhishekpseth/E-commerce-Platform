import styles from "./LoadingLight.module.css";

const LoadingLight = () => {
  return (
    <div className="absolute top-[40%] height-full width-full">
      <div className={styles.Loading}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default LoadingLight;
