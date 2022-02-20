import styles from "./output.module.css";

const Output = ({ empId, projectId, workedDays }) => {
  return (
    <tr>
      <td className={styles.col}>{empId}</td>
      <td className={styles.col}>{projectId}</td>
      <td className={styles.col}>{workedDays}</td>
    </tr>
  );
};

export default Output;
