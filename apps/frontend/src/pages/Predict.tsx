import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { mlApi } from "@/lib/api";

const formSchema = z.object({
  symptoms: z.array(z.string()).min(1, "Select at least one symptom"),
});

type PredictResponse = {
  disease: string;
  probability: number;
  description: string;
  precautions: string[];
};

export default function PredictPage() {
  // Fetch all symptoms
  const { data: symptomsData, isPending } = useQuery({
    queryKey: ["symptoms"],
    queryFn: async () => {
      const response = await mlApi.get("symptoms").json<{
        symptoms: string[];
      }>();

      return response.symptoms;
    },
  });

  // Prediction mutation
  const predictionMutation = useMutation({
    mutationFn: async (symptoms: string[]) => {
      return mlApi
        .post("predict", {
          json: { symptoms },
        })
        .json<PredictResponse>();
    },

    onError: () => {
      toast.error("Failed to predict disease");
    },
  });

  const form = useForm({
    defaultValues: {
      symptoms: [] as string[],
    },

    validators: {
      onSubmit: formSchema,
    },

    onSubmit: async ({ value }) => {
      await predictionMutation.mutateAsync(value.symptoms);
    },
  });

  const prediction = predictionMutation.data;

  return (
    <div className="flex justify-center p-6">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl">Disease Prediction</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.Field name="symptoms">
              {(field) => (
                <div className="space-y-4">
                  <Label>Select Symptoms</Label>

                  <Combobox
                    multiple
                    autoHighlight
                    items={symptomsData ?? []}
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <ComboboxChips className="w-full">
                      <ComboboxValue>
                        {(values) => (
                          <>
                            {values.map((value: string) => (
                              <ComboboxChip key={value}>{value}</ComboboxChip>
                            ))}

                            <ComboboxChipsInput placeholder="Search symptoms..." />
                          </>
                        )}
                      </ComboboxValue>
                    </ComboboxChips>

                    <ComboboxContent>
                      <ComboboxEmpty>No symptoms found.</ComboboxEmpty>

                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem key={item} value={item}>
                            {item}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>

                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <Button
              type="submit"
              disabled={predictionMutation.isPending}
              className="w-full"
            >
              {predictionMutation.isPending
                ? "Predicting..."
                : "Predict Disease"}
            </Button>
          </form>

          {prediction && (
            <div className="mt-8 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Prediction Result</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    {/* <h3 className="font-semibold">Disease</h3>
                    <p>{prediction.disease}</p> */}
                    <h3 className="font-semibold">
                      {prediction.probability >= 0.8
                        ? "Likely Condition"
                        : prediction.probability >= 0.5
                          ? "Possible Condition"
                          : "Low-confidence Prediction"}
                    </h3>

                    <p>{prediction.disease}</p>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {prediction.probability >= 0.8
                        ? "This AI-generated result suggests a likely matching condition. Please consult a healthcare professional for confirmation."
                        : prediction.probability >= 0.5
                          ? "This AI-generated result suggests a possible matching condition and should not be considered a medical diagnosis."
                          : "Prediction confidence is low. More symptoms may be required for a better analysis."}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold">Confidence</h3>
                    <p>{(prediction.probability * 100).toFixed(2)}%</p>
                  </div>

                  <div>
                    <h3 className="font-semibold">Description</h3>

                    <p className="text-muted-foreground">
                      {prediction.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold">Precautions</h3>

                    <ul className="list-disc space-y-1 pl-5">
                      {prediction.precautions.map((precaution) => (
                        <li key={precaution}>{precaution}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
