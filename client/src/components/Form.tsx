import { useForm } from "react-hook-form";
import "./styles.scss";

type FormValues = {
  originalUrl: string;
  expiresAt?: Date;
  alias?: string;
};

function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
  fetch("http://localhost:4000/api/shorten", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Server error");
      }
      return response.json();
    })
    .then((result) => {
      console.log("Success:", result);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  };

  return (
    <>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="link" className="label">
          Link <span style={{ color: "red" }}>*</span>
        </label>
        <input
          {...register("originalUrl", {
            required: "Link is required",
            pattern: {
              value: /^[A-Za-z]+$/,
              message: "Only Latin letters allowed",
            },
          })}
          placeholder="Link"
          className={`input ${errors.originalUrl ? "input-error" : ""}`}
        />
        {errors.originalUrl && (
          <p className="error">{errors.originalUrl.message}</p>
        )}

        <label htmlFor="expiresAt" className="label">
          Link epiration date (required)
        </label>
        <input
          {...register("expiresAt")}
          placeholder="Expiration date"
          className="input"
        />
        {errors.expiresAt && (
          <p className="error">{errors.expiresAt.message}</p>
        )}

        <label htmlFor="alias" className="label">
          Alias (optional)
        </label>
        <input
          {...register("alias", {
            pattern: {
              value: /^[A-Za-z]+$/,
              message: "Only Latin letters allowed",
            },
            maxLength: {
              value: 20,
              message: "Maximum length is 20 characters",
            },
          })}
          placeholder="alias"
          className="input"
        />
        {errors.alias && <p className="error">{errors.alias.message}</p>}

        <input type="submit" className="btn" />
      </form>
    </>
  );
}

export default Form;
