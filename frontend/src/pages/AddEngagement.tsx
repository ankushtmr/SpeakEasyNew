// frontend/src/pages/AddEngagement.tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEngagement } from "../api";
import type { EngagementInput } from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const schema = z.object({
  // Client
  dealName: z.string().min(1, "Deal name is required"),
  clientName: z.string().min(1, "Client name is required"),
  industry: z.string().optional(),
  audience: z.string().optional(),
  eventType: z.string().optional(),

  // Talk
  talkTitle: z.string().min(1, "Talk title is required"),
  talkDate: z.string().min(1, "Talk date is required"), // YYYY-MM-DD from <input type="date">
  format: z.enum(["IN_PERSON", "ONLINE"] as const, {
  required_error: "Format is required",
}),

  // Region
  location: z.string().min(1, "Location is required")
});

type FormValues = z.infer<typeof schema>;

export default function AddEngagement() {
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      format: "IN_PERSON"
    }
  });

  async function onSubmit(values: FormValues) {
  try {
    const token = await getAccessTokenSilently({
  authorizationParams: {
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    scope: "openid profile email"
  }
});           // 👈 get JWT
    await createEngagement(values as EngagementInput, token); // 👈 pass JWT
    reset();
    navigate("/dashboard");
  } catch (err: any) {
    console.error("Create failed:", err);
    alert(`Failed to save: ${err.message}`);               // temp feedback
  }
}

  return (
    <main style={{ padding: 24, maxWidth: 640 }}>
      <h2>Add Engagement</h2>
      <p style={{ marginBottom: 16 }}>
        Capture Client, Talk, and Region details (our Phase‑1 inputs).
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Client Details */}
        <fieldset style={{ marginBottom: 16 }}>
          <legend><strong>Client Details</strong></legend>

          <label>Deal Name<br />
            <input {...register("dealName")} />
          </label>
          {errors.dealName && <div style={{color:"crimson"}}>{errors.dealName.message}</div>}

          <br /><br />

          <label>Client Name<br />
            <input {...register("clientName")} />
          </label>
          {errors.clientName && <div style={{color:"crimson"}}>{errors.clientName.message}</div>}

          <br /><br />

          <label>Industry (optional)<br />
            <input {...register("industry")} placeholder="Marketing, Finance, etc." />
          </label>

          <br /><br />

          <label>Audience (optional)<br />
            <input {...register("audience")} placeholder="e.g., 500 attendees, roles" />
          </label>

          <br /><br />

          <label>Event Type (optional)<br />
            <input {...register("eventType")} placeholder="Conference, Gala Dinner, etc." />
          </label>
        </fieldset>

        {/* Talk Details */}
        <fieldset style={{ marginBottom: 16 }}>
          <legend><strong>Talk Details</strong></legend>

          <label>Talk Title<br />
            <input {...register("talkTitle")} />
          </label>
          {errors.talkTitle && <div style={{color:"crimson"}}>{errors.talkTitle.message}</div>}

          <br /><br />

          <label>Talk Date<br />
            <input type="date" {...register("talkDate")} />
          </label>
          {errors.talkDate && <div style={{color:"crimson"}}>{errors.talkDate.message}</div>}

          <br /><br />

          <label>Format<br />
            <select {...register("format")}>
              <option value="IN_PERSON">In Person</option>
              <option value="ONLINE">Online</option>
            </select>
          </label>
          {errors.format && <div style={{color:"crimson"}}>{errors.format.message}</div>}
        </fieldset>

        {/* Region Details */}
        <fieldset style={{ marginBottom: 16 }}>
          <legend><strong>Region Details</strong></legend>

          <label>Location<br />
            <input {...register("location")} placeholder="City, Country" />
          </label>
          {errors.location && <div style={{color:"crimson"}}>{errors.location.message}</div>}
        </fieldset>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save Engagement"}
        </button>
      </form>
    </main>
  );
}
