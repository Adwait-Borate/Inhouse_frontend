import { useState } from "react";
import {
  Card,
  Select,
  Option,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { addRecordsSport, uploadRecordsSport } from "./API_Routes";

export default function SportData() {
  const navigate = useNavigate();
  const [isFinancialSupport, setIsFinancialSupport] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    S_ID: null,
    Username: currentUser?.Username,
    Academic_Year: "",
    Student_Name: currentUser?.Name,
    Roll_No: "",
    Department: "",
    Year: "",
    Participant_or_Organizer_for_the_Event: "",
    Sports_Name: "",
    Sub_Event_Name: "",
    Sports_Type: "",
    Activity_Type: "",
    Organizer_Name: "",
    Level: "",
    Place: "",
    Start_Date: "",
    End_Date: "",
    Financial_support_given_by_institute_in_INR: "",
    Award: "",
    Award_Prize_Money: "",
    Remarks: "",
    Geo_Tag_Photos: "",
    Certificates: null,
    Evidence: null,
  });

  const handleOnChange = (e) => {
    const { id, value, type, files } = e.target;

    setFormData({
      ...formData,
      [id]:
        type === "file" ? (files && files.length > 0 ? files[0] : null) : value,
    });
  };

  const generateAcademicYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const Options = [];

    for (let year = 2023; year <= currentYear; year++) {
      const academicYearStart = `${year}-${year + 1}`;
      Options.push(
        <Option key={academicYearStart} value={academicYearStart}>
          {academicYearStart}
        </Option>
      );
    }

    return Options;
  };

  const handleFileUpload = async (file) => {
    try {
      console.log("file as:", file);

      const formDataForFile = new FormData();
      formDataForFile.append("file", file);
      formDataForFile.append("username", currentUser?.Username);
      formDataForFile.append("role", currentUser?.Role);
      formDataForFile.append("tableName", "student_sports_data");
      formDataForFile.append("columnName", [
        "Certificates",
        "Evidence",
      ]);


      const response = await axios.post(uploadRecordsSport, formDataForFile);
      console.log(response);
      // console.log("file response:", response.data.filePath);

      return response.data.filePath;
    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle error as needed
    }
  };

  //add new record
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    var pathEvidence = null,
      pathReport;
    console.log(isFinancialSupport);
    console.log(formData.Evidence);
    // Check if evidence upload is required
    if (isFinancialSupport && formData.Evidence === null) {
      alert("Upload Evidence document");
      return;
    }

    try {
      if (isFinancialSupport) {
        console.log("hi");
        // Handle evidence upload only if financial support is selected
        pathEvidence = await handleFileUpload(formData.Evidence);
      }
      if (formData.Certificates !== null) {
        console.log("1");

        console.log("2");
        pathReport = await handleFileUpload(formData.Certificates);

        // console.log("Upload path = ", pathUpload);
      } else {
        toast.error("Please select a file for upload", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }
      // console.log("Evidence path:",pathEvidence);
      // If file upload is successful, continue with the form submission

      const formDataWithFilePath = {
        ...formData,

        Evidence: pathEvidence,
        Certificates: pathReport,
      };
      if (pathEvidence === "" && pathReport === "") {
        // If file is null, display a toast alert
        toast.error("Some error occurred while uploading file", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }

      console.log("Final data:", formDataWithFilePath);

      // Send a POST request to the addRecordsBook API endpoint
      await axios.post(addRecordsSport, formDataWithFilePath);

      // Display a success toast
      toast.success("Record Added Successfully", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      // Navigate to "/t/data" after successful submission
      navigate("/s/data");
    } catch (error) {
      // Handle file upload error
      console.error("File upload error:", error);

      // Display an error toast
      toast.error("File upload failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <>
      <Card
        color="transparent"
        shadow={false}
        className="border border-gray-300 w-85 mx-auto p-2 my-2 rounded-md"
      >
        <Typography
          variant="h4"
          color="blue-gray"
          className="mx-auto underline underline-offset-2"
        >
          Sport Data
        </Typography>

        <form className="mt-8 mb-2" onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Department
              </Typography>
              <Select
                id="Department"
                size="lg"
                label="Department"
                value={formData.Department}
                onChange={(value) =>
                  handleOnChange({
                    target: { id: "Department", value },
                  })
                }
              >
                <Option value="CS">CS</Option>
                <Option value="IT">IT</Option>
                <Option value="EnTC">EnTC</Option>
                <Option value="FE">FE</Option>
              </Select>
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Academic Year
              </Typography>
              <Select
                size="lg"
                id="Academic_Year"
                value={formData.Academic_Year}
                label="Academic Year"
                onChange={(value) =>
                  handleOnChange({
                    target: { id: "Academic_Year", value },
                  })
                }
              >
                {generateAcademicYearOptions()}
              </Select>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Year of Study
              </Typography>
              <Select
                id="Year"
                size="lg"
                label="Year"
                value={formData.Year}
                onChange={(value) =>
                  handleOnChange({
                    target: { id: "Year", value },
                  })
                }
              >
                <Option value="FE">FE</Option>
                <Option value="SE">SE</Option>
                <Option value="TE">TE</Option>
                <Option value="BE">BE</Option>
              </Select>
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Roll No
              </Typography>
              <Input
                id="Roll_No"
                size="lg"
                label="Roll No"
                value={formData.Roll_No}
                onChange={handleOnChange}
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Sport Name
              </Typography>
              <Input
                id="Sports_Name"
                size="lg"
                label="Organized Byr"
                value={formData.Sports_Name}
                onChange={handleOnChange}
              />
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Participant or Organizer
              </Typography>
              <Input
                id="Participant_or_Organizer_for_the_Event"
                size="lg"
                label="Certificate Course Title"
                value={formData.Participant_or_Organizer_for_the_Event}
                onChange={handleOnChange}
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Sub Event Name
              </Typography>
              <Input
                id="Sub_Event_Name"
                size="lg"
                label="Sub Event Name"
                value={formData.Sub_Event_Name}
                onChange={handleOnChange}
              />
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Sport Type
              </Typography>
              <Input
                id="Sports_Type"
                size="lg"
                label="Sport Type"
                value={formData.Sports_Type}
                onChange={handleOnChange}
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Activity Type
              </Typography>
              <Select
                id="Activity_Type"
                size="lg"
                label="Activity Type"
                value={formData.Activity_Type}
                onChange={(value) =>
                  handleOnChange({
                    target: { id: "Activity_Type", value },
                  })
                }
              >
                <Option value="Teamwork">Teamwork</Option>
                <Option value="Individual">Individual</Option>
              </Select>
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Organizer Name
              </Typography>
              <Input
                id="Organizer_Name"
                size="lg"
                label="Organizer_Name"
                value={formData.Organizer_Name}
                onChange={handleOnChange}
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Level
              </Typography>
              <Select
                id="Level"
                size="lg"
                label="Select Level"
                value={formData.Level}
                onChange={(value) =>
                  handleOnChange({
                    target: { id: "Level", value },
                  })
                }
              >
                <Option value="National">National</Option>
                <Option value="International">International</Option>
                <Option value="InterCollege">InterCollege</Option>
                <Option value="IntraCollege">IntraCollege</Option>
                <Option value="University">University</Option>
                <Option value="State">State</Option>
              </Select>
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Place
              </Typography>
              <Input
                id="Place"
                size="lg"
                label="Place"
                value={formData.Place}
                onChange={handleOnChange}
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Start Date
              </Typography>
              <Input
                id="Start_Date"
                size="lg"
                label="Start Date"
                type="date"
                value={formData.Start_Date}
                onChange={handleOnChange}
              />
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                End Date
              </Typography>
              <Input
                id="End_Date"
                size="lg"
                label="End Date"
                type="date"
                value={formData.End_Date}
                onChange={handleOnChange}
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full">
              <div className="px-4 mb-4 flex gap-40">
                <Typography variant="h6" color="blue-gray" className="mb-3">
                  Financial support from institute in INR
                </Typography>
                <div className="flex gap-3">
                  <label className="mx-2">
                    <input
                      type="radio"
                      name="financialSupport"
                      value="yes"
                      checked={isFinancialSupport}
                      onChange={() => setIsFinancialSupport(true)}
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="financialSupport"
                      value="no"
                      checked={!isFinancialSupport}
                      onChange={() => setIsFinancialSupport(false)}
                    />
                    No
                  </label>
                </div>
              </div>
              <div className="flex justify-between flex-col md:flex-row">
                <div className="w-full md:w-1/2 px-4 mb-4">
                  <Input
                    size="lg"
                    label="Amount in INR"
                    id="Financial_support_given_by_institute_in_INR"
                    type="number"
                    value={formData.Financial_support_given_by_institute_in_INR}
                    onChange={handleOnChange}
                    disabled={!isFinancialSupport}
                  />
                </div>
                <div className="w-full md:w-1/2 px-4 mb-4">
                  <Input
                    size="lg"
                    label="Evidence Document"
                    id="Evidence"
                    type="file"
                    onChange={handleOnChange}
                    disabled={!isFinancialSupport}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Award
              </Typography>
              <Input
                id="Award"
                size="lg"
                label="Award"
                value={formData.Award}
                onChange={handleOnChange}
              />
            </div>

            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Award_Prize_Money
              </Typography>
              <Input
                id="Award_Prize_Money"
                size="lg"
                label="Award_Prize_Money"
                value={formData.Award_Prize_Money}
                onChange={handleOnChange}
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Upload Completion Certificate (Only Pdf)
              </Typography>
              <Input
                id="Certificates"
                size="lg"
                label=""
                type="file"
                onChange={handleOnChange}
              />
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Geo Tag Photos
              </Typography>
              <Input
                id="Geo_Tag_Photos"
                size="lg"
                label="Geo Tag Photos"
                value={formData.Geo_Tag_Photos}
                onChange={handleOnChange}
              />
            </div>
          </div>
          <div className="mb-4 flex flex-wrap -mx-4">
            <div className="w-full  px-4 mb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Remarks
              </Typography>
              <Input
                id="Remarks"
                size="lg"
                label="Remarks"
                value={formData.Remarks}
                onChange={handleOnChange}
              />
            </div>
          </div>

          <Button type="submit" className="mt-4" fullWidth>
           Submit
          </Button>
        </form>
      </Card>
    </>
  );
}
