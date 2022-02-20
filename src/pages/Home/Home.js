import { useState } from "react";
import { Output } from "../../components";
import { oneDay } from "../../constants";
import styles from "./home.module.css";

const Home = () => {
  const [file, setFile] = useState();
  const [array, setArray] = useState([]);
  const fileReader = new FileReader();

  const sameProjectsArr = (arr) => {
    const arrWithSameIds = [];
    const finalArr = [];

    arr.forEach((obj) => {
      const isSame =
        arr.map((e) => e.ProjectId).filter((id) => id === obj.ProjectId)
          .length - 1;

      if (isSame) {
        const startDate = new Date(obj.DateFrom);
        const endDate = isNaN(Date.parse(obj.DateTo))
          ? new Date()
          : new Date(obj.DateTo);

        const workedTime = endDate.getTime() - startDate.getTime();
        const workedDays = Math.round(workedTime / oneDay);
        obj.WorkedDays = workedDays;

        arrWithSameIds.push(obj);
      }
    });

    arrWithSameIds
      .sort((a, b) => a.ProjectId - b.ProjectId)
      .sort((a, b) => {
        if (a.ProjectId === b.ProjectId) {
          return b.WorkedDays - a.WorkedDays;
        }
        return a - b;
      });

    const groupedArr = arrWithSameIds.reduce((acc, arr, i) => {
      if (!i || acc[acc.length - 1][0].ProjectId !== arr.ProjectId) {
        return acc.concat([[arr]]);
      }
      acc[acc.length - 1].push(arr);
      return acc;
    }, []);

    groupedArr.forEach((e) => {
      const spliced = e.splice(0, 2);
      finalArr.push(spliced);
    });

    setArray(finalArr);
  };

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const csvFileToArray = (string) => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const clearCSVHeaders = csvHeader.map((headerTxt) =>
      headerTxt.replace("\r", "")
    );

    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows.map((i) => {
      const values = i.split(",");
      const obj = clearCSVHeaders.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });

    sameProjectsArr(array);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);
      };

      fileReader.readAsText(file);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Employees working on same projects</h1>
      <form className={styles.form}>
        <div className={styles.inputHolder}>
          <input
            type={"file"}
            id={"csvFileInput"}
            accept={".csv"}
            onChange={handleOnChange}
            className={styles.input}
          />
        </div>
        <div className={styles.btnContainer}>
          <button
            className={styles.button}
            onClick={(e) => {
              handleOnSubmit(e);
            }}
            style={file ? { backgroundColor: "green", color: "white" } : {}}
          >
            Submit
          </button>
        </div>
      </form>
      {array.length > 0 ? (
        <table className={styles.output}>
          <thead>
            <tr className={styles.headerRow}>
              <th className={styles.col}>Employee ID</th>
              <th className={styles.col}>Project ID</th>
              <th className={styles.col}>Worked Days</th>
            </tr>
          </thead>
          {array.map((e, i) => (
            <tbody key={i}>
              {e.map((arr, i) => (
                <Output
                  key={i}
                  empId={arr.EmpId}
                  projectId={arr.ProjectId}
                  workedDays={arr.WorkedDays}
                />
              ))}
            </tbody>
          ))}
        </table>
      ) : (
        ""
      )}

      <br />
    </div>
  );
};

export default Home;
