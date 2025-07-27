// "use client";

// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import ReactMarkdown from "react-markdown";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Progress } from "@/components/ui/progress";
// import {
//   FileText,
//   CheckCircle,
//   AlertCircle,
//   Loader2,
//   Upload,
//   Download,
//   RefreshCw,
// } from "lucide-react";
// import { sopService } from "@/lib/sop-service";
// import { useNotification } from "@/components/notification/notification-provider";
// import { askChatbot } from "@/lib/sop-ai-service";

// export default function SopReview() {
//   const [sopText, setSopText] = useState("");
//   const [feedback, setFeedback] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasReviewed, setHasReviewed] = useState(false);
//   const [validationErrors, setValidationErrors] = useState([]);
//   const { showNotification } = useNotification();
//   const [aiFeedback, setAiFeedback] = useState("");

//   const handleTextChange = (e) => {
//     const text = e.target.value;
//     setSopText(text);

//     // Real-time validation
//     const validation = sopService.validateSopText(text);
//     setValidationErrors(validation.errors);

//     // Clear previous feedback when text changes significantly
//     if (hasReviewed && text.length > 0) {
//       setHasReviewed(false);
//       setFeedback("");
//     }
//   };

//   // const handleReview = async () => {
//   //   const validation = sopService.validateSopText(sopText);

//   //   if (!validation.isValid) {
//   //     setValidationErrors(validation.errors);
//   //     showNotification(
//   //       "Please fix the validation errors before reviewing.",
//   //       "error"
//   //     );
//   //     return;
//   //   }

//   //   setIsLoading(true);
//   //   setValidationErrors([]);

//   //   try {
//   //     const result = await sopService.reviewSop(sopText);
//   //     setFeedback(result.feedback);
//   //     setHasReviewed(true);
//   //     showNotification("SOP review completed successfully!", "success");
//   //   } catch (error) {
//   //     console.error("Error reviewing SOP:", error);
//   //     showNotification(
//   //       error.message || "Failed to review SOP. Please try again.",
//   //       "error"
//   //     );
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   // const handleReview = async () => {
//   //   const validation = sopService.validateSopText(sopText);
//   //   if (!validation.isValid) {
//   //     setValidationErrors(validation.errors);
//   //     showNotification(
//   //       "Please fix the validation errors before reviewing.",
//   //       "error"
//   //     );
//   //     return;
//   //   }

//   //   setIsLoading(true);
//   //   setValidationErrors([]);

//   //   try {
//   //     const [sopResult, aiResult] = await Promise.all([
//   //       sopService.reviewSop(sopText),
//   //       askChatbot(sopText),
//   //     ]);

//   //     const combinedFeedback = `
//   //     <h3>SOP Service Feedback:</h3>
//   //     ${sopService.formatFeedback(sopResult.feedback)}
//   //     <br/><hr/><br/>
//   //     <h3>AI Chatbot Feedback:</h3>
//   //     ${sopService.formatFeedback(aiResult.response)}
//   //   `;

//   //     setFeedback(combinedFeedback);
//   //     setHasReviewed(true);
//   //     showNotification("SOP reviewed by both services!", "success");
//   //   } catch (error) {
//   //     console.error("Error reviewing SOP:", error);
//   //     showNotification(error.message || "Failed to review SOP.", "error");
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   const handleReview = async () => {
//     const validation = sopService.validateSopText(sopText);
//     if (!validation.isValid) {
//       setValidationErrors(validation.errors);
//       showNotification(
//         "Please fix the validation errors before reviewing.",
//         "error"
//       );
//       return;
//     }

//     setIsLoading(true);
//     setValidationErrors([]);
//     setHasReviewed(false);
//     setFeedback("");
//     setAiFeedback("");

//     try {
//       const [sopResult, aiResult] = await Promise.all([
//         sopService.reviewSop(sopText),
//         askChatbot(sopText),
//       ]);

//       setFeedback(sopResult.feedback);
//       setAiFeedback(aiResult.response);
//       setHasReviewed(true);
//       showNotification("SOP reviewed by both services!", "success");
//     } catch (error) {
//       console.error("Error reviewing SOP:", error);
//       showNotification(error.message || "Failed to review SOP.", "error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleClear = () => {
//     setSopText("");
//     setFeedback("");
//     setHasReviewed(false);
//     setValidationErrors([]);
//     showNotification("SOP content cleared.", "info");
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (file.type !== "text/plain" && !file.name.endsWith(".txt")) {
//       showNotification("Please upload a text file (.txt)", "error");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const text = e.target.result;
//       setSopText(text);
//       showNotification("File uploaded successfully!", "success");
//     };
//     reader.readAsText(file);
//   };

//   const handleDownload = () => {
//     if (!sopText) {
//       showNotification("No content to download", "warning");
//       return;
//     }

//     const element = document.createElement("a");
//     const file = new Blob([sopText], { type: "text/plain" });
//     element.href = URL.createObjectURL(file);
//     element.download = "my-sop.txt";
//     document.body.appendChild(element);
//     element.click();
//     document.body.removeChild(element);
//     showNotification("SOP downloaded successfully!", "success");
//   };

//   const getCharacterCountColor = () => {
//     const length = sopText.length;
//     if (length < 100) return "text-yellow-600";
//     if (length > 8000) return "text-orange-600";
//     if (length > 9500) return "text-red-600";
//     return "text-green-600";
//   };

//   const getProgressValue = () => {
//     const length = sopText.length;
//     const minLength = 100;
//     const maxLength = 2000; // Ideal maximum length

//     if (length < minLength) return (length / minLength) * 25;
//     if (length <= maxLength)
//       return 25 + ((length - minLength) / (maxLength - minLength)) * 50;
//     return 75 + Math.min(((length - maxLength) / (10000 - maxLength)) * 25, 25);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight flex items-center">
//             <FileText className="mr-3 h-8 w-8 text-primary" />
//             SOP Review
//           </h1>
//           <p className="text-muted-foreground mt-1">
//             Get detailed feedback on your Statement of Purpose with AI-powered
//             grammar and style analysis.
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             onClick={handleDownload}
//             disabled={!sopText}
//           >
//             <Download className="mr-2 h-4 w-4" />
//             Download
//           </Button>
//           <Button
//             variant="outline"
//             onClick={handleClear}
//             disabled={!sopText && !feedback}
//           >
//             <RefreshCw className="mr-2 h-4 w-4" />
//             Clear
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[700px]">
//         {/* Input Section */}
//         <Card className="flex flex-col h-full">
//           <CardHeader className="flex-shrink-0">
//             <CardTitle className="flex items-center justify-between">
//               <span>Your Statement of Purpose</span>
//               <Badge variant="outline">
//                 <span className={getCharacterCountColor()}>
//                   {sopText.length.toLocaleString()} / 10,000
//                 </span>
//               </Badge>
//             </CardTitle>
//             <CardDescription>
//               Write or paste your SOP below. We recommend 500-2000 words for a
//               comprehensive review.
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4 flex-1 flex flex-col">
//             {/* File Upload */}
//             <div className="flex items-center gap-2">
//               <input
//                 type="file"
//                 accept=".txt"
//                 onChange={handleFileUpload}
//                 className="hidden"
//                 id="sop-upload"
//               />
//               <label htmlFor="sop-upload">
//                 <Button variant="outline" size="sm" asChild>
//                   <span className="cursor-pointer">
//                     <Upload className="mr-2 h-4 w-4" />
//                     Upload Text File
//                   </span>
//                 </Button>
//               </label>
//             </div>

//             {/* Progress Bar */}
//             <div className="space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span className="text-muted-foreground">Completeness</span>
//                 <span className="text-muted-foreground">
//                   {Math.round(getProgressValue())}%
//                 </span>
//               </div>
//               <Progress value={getProgressValue()} className="h-2" />
//             </div>

//             {/* Text Area */}

//             <Textarea
//               placeholder="Start writing your Statement of Purpose here...

// A strong SOP typically includes:
// • Your academic background and achievements
// • Research interests and career goals
// • Why you chose this specific program
// • Relevant experiences and skills
// • Future aspirations and contributions

// Remember to be authentic, specific, and compelling in your narrative."
//               value={sopText}
//               onChange={handleTextChange}
//               className="min-h-[400px] resize-none"
//             />

//             {/* Validation Errors */}
//             {validationErrors.length > 0 && (
//               <Alert variant="destructive">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertDescription>
//                   <ul className="list-disc list-inside">
//                     {validationErrors.map((error, index) => (
//                       <li key={index}>{error}</li>
//                     ))}
//                   </ul>
//                 </AlertDescription>
//               </Alert>
//             )}

//             {/* Action Button */}
//             <Button
//               onClick={handleReview}
//               disabled={
//                 isLoading || validationErrors.length > 0 || !sopText.trim()
//               }
//               className="w-full"
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Analyzing your SOP...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle className="mr-2 h-4 w-4" />
//                   Review My SOP
//                 </>
//               )}
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Feedback Section */}
//         <Card className="flex flex-col h-full">
//           <CardHeader className="flex-shrink-0">
//             <CardTitle className="flex items-center justify-between">
//               <span>Review Results</span>
//               {hasReviewed && (
//                 <Badge variant="default">
//                   <CheckCircle className="mr-1 h-3 w-3" />
//                   Reviewed
//                 </Badge>
//               )}
//             </CardTitle>
//             <CardDescription>
//               Detailed feedback and suggestions to improve your SOP
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="flex-1 overflow-hidden">
//             <div className="h-full max-h-[600px] overflow-y-auto pr-2">
//               {!hasReviewed && !isLoading && (
//                 <div className="text-center py-12">
//                   <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
//                   <h3 className="text-lg font-medium mb-2">Ready to Review</h3>
//                   <p className="text-muted-foreground">
//                     Enter your SOP text and click "Review My SOP" to get
//                     detailed feedback.
//                   </p>
//                 </div>
//               )}

//               {isLoading && (
//                 <div className="text-center py-12">
//                   <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin mb-4" />
//                   <h3 className="text-lg font-medium mb-2">
//                     Analyzing Your SOP
//                   </h3>
//                   <p className="text-muted-foreground">
//                     Please wait while we review your statement for grammar,
//                     style, and clarity.
//                   </p>
//                 </div>
//               )}

//               {hasReviewed && feedback && (
//                 <div className="space-y-4">
//                   <div className="prose prose-sm max-w-none">
//                     <div
//                       className="text-sm leading-relaxed"
//                       dangerouslySetInnerHTML={{
//                         __html: sopService.formatFeedback(feedback),
//                       }}
//                     />
//                   </div>

//                   {feedback.includes("No grammar or spelling errors") && (
//                     <Alert>
//                       <CheckCircle className="h-4 w-4" />
//                       <AlertDescription>
//                         Great job! Your SOP appears to be well-written with no
//                         major issues detected.
//                       </AlertDescription>
//                     </Alert>
//                   )}
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//       {/* AI Chatbot Feedback Section */}
//       {hasReviewed && aiFeedback && (
//         <Card className="mt-6">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               AI Chatbot Feedback
//               <Badge variant="secondary">Experimental</Badge>
//             </CardTitle>
//             <CardDescription>
//               Feedback generated by a general-purpose AI to guide you on
//               structure and storytelling
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ReactMarkdown className="prose prose-sm max-w-none">
//               {/* <pre className="max-h-[500px] overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap prose prose-sm"> */}
//               {aiFeedback}
//               {/* </pre> */}
//             </ReactMarkdown>
//           </CardContent>
//         </Card>
//       )}

//       {/* Tips Section */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Tips for a Strong SOP</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <h4 className="font-medium text-primary">Structure</h4>
//               <ul className="text-sm text-muted-foreground space-y-1">
//                 <li>• Start with a compelling opening</li>
//                 <li>• Maintain logical flow between paragraphs</li>
//                 <li>• End with strong future goals</li>
//               </ul>
//             </div>
//             <div className="space-y-2">
//               <h4 className="font-medium text-secondary">Content</h4>
//               <ul className="text-sm text-muted-foreground space-y-1">
//                 <li>• Be specific about your experiences</li>
//                 <li>• Show passion for your field</li>
//                 <li>• Connect past experiences to future goals</li>
//               </ul>
//             </div>
//             <div className="space-y-2">
//               <h4 className="font-medium text-accent">Language</h4>
//               <ul className="text-sm text-muted-foreground space-y-1">
//                 <li>• Use active voice</li>
//                 <li>• Avoid repetitive phrases</li>
//                 <li>• Maintain professional tone</li>
//               </ul>
//             </div>
//             <div className="space-y-2">
//               <h4 className="font-medium text-orange-600">Formatting</h4>
//               <ul className="text-sm text-muted-foreground space-y-1">
//                 <li>• Keep paragraphs concise</li>
//                 <li>• Use proper punctuation</li>
//                 <li>• Check for typos and errors</li>
//               </ul>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Upload,
  Download,
  RefreshCw,
} from "lucide-react";
import { sopService } from "@/lib/sop-service";
import { useNotification } from "@/components/notification/notification-provider";
import { askChatbot } from "@/lib/sop-ai-service";

export default function SopReview() {
  const [sopText, setSopText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const { showNotification } = useNotification();
  const [aiFeedback, setAiFeedback] = useState("");

  const handleTextChange = (e) => {
    const text = e.target.value;
    setSopText(text);

    // Real-time validation
    const validation = sopService.validateSopText(text);
    setValidationErrors(validation.errors);

    // Clear previous feedback when text changes significantly
    if (hasReviewed && text.length > 0) {
      setHasReviewed(false);
      setFeedback("");
    }
  };

  // const handleReview = async () => {
  //   const validation = sopService.validateSopText(sopText);

  //   if (!validation.isValid) {
  //     setValidationErrors(validation.errors);
  //     showNotification(
  //       "Please fix the validation errors before reviewing.",
  //       "error"
  //     );
  //     return;
  //   }

  //   setIsLoading(true);
  //   setValidationErrors([]);

  //   try {
  //     const result = await sopService.reviewSop(sopText);
  //     setFeedback(result.feedback);
  //     setHasReviewed(true);
  //     showNotification("SOP review completed successfully!", "success");
  //   } catch (error) {
  //     console.error("Error reviewing SOP:", error);
  //     showNotification(
  //       error.message || "Failed to review SOP. Please try again.",
  //       "error"
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleReview = async () => {
  //   const validation = sopService.validateSopText(sopText);
  //   if (!validation.isValid) {
  //     setValidationErrors(validation.errors);
  //     showNotification(
  //       "Please fix the validation errors before reviewing.",
  //       "error"
  //     );
  //     return;
  //   }

  //   setIsLoading(true);
  //   setValidationErrors([]);

  //   try {
  //     const [sopResult, aiResult] = await Promise.all([
  //       sopService.reviewSop(sopText),
  //       askChatbot(sopText),
  //     ]);

  //     const combinedFeedback = `
  //     <h3>SOP Service Feedback:</h3>
  //     ${sopService.formatFeedback(sopResult.feedback)}
  //     <br/><hr/><br/>
  //     <h3>AI Chatbot Feedback:</h3>
  //     ${sopService.formatFeedback(aiResult.response)}
  //   `;

  //     setFeedback(combinedFeedback);
  //     setHasReviewed(true);
  //     showNotification("SOP reviewed by both services!", "success");
  //   } catch (error) {
  //     console.error("Error reviewing SOP:", error);
  //     showNotification(error.message || "Failed to review SOP.", "error");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleReview = async () => {
    const validation = sopService.validateSopText(sopText);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      showNotification(
        "Please fix the validation errors before reviewing.",
        "error"
      );
      return;
    }

    setIsLoading(true);
    setValidationErrors([]);
    setHasReviewed(false);
    setFeedback("");
    setAiFeedback("");

    try {
      const [sopResult, aiResult] = await Promise.all([
        sopService.reviewSop(sopText),
        askChatbot(sopText),
      ]);

      setFeedback(sopResult.feedback);
      setAiFeedback(aiResult.response);
      setHasReviewed(true);
      showNotification("SOP reviewed by both services!", "success");
    } catch (error) {
      console.error("Error reviewing SOP:", error);
      showNotification(error.message || "Failed to review SOP.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSopText("");
    setFeedback("");
    setHasReviewed(false);
    setValidationErrors([]);
    showNotification("SOP content cleared.", "info");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "text/plain" && !file.name.endsWith(".txt")) {
      showNotification("Please upload a text file (.txt)", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      setSopText(text);
      showNotification("File uploaded successfully!", "success");
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (!sopText) {
      showNotification("No content to download", "warning");
      return;
    }

    const element = document.createElement("a");
    const file = new Blob([sopText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "my-sop.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showNotification("SOP downloaded successfully!", "success");
  };

  const getCharacterCountColor = () => {
    const length = sopText.length;
    if (length < 100) return "text-yellow-600";
    if (length > 8000) return "text-orange-600";
    if (length > 9500) return "text-red-600";
    return "text-green-600";
  };

  const getProgressValue = () => {
    const length = sopText.length;
    const minLength = 100;
    const maxLength = 2000; // Ideal maximum length

    if (length < minLength) return (length / minLength) * 25;
    if (length <= maxLength)
      return 25 + ((length - minLength) / (maxLength - minLength)) * 50;
    return 75 + Math.min(((length - maxLength) / (10000 - maxLength)) * 25, 25);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <FileText className="mr-3 h-8 w-8 text-primary" />
            SOP Review
          </h1>
          <p className="text-muted-foreground mt-1">
            Get detailed feedback on your Statement of Purpose with AI-powered
            grammar and style analysis.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={!sopText}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={!sopText && !feedback}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Statement of Purpose</span>
              <Badge variant="outline">
                <span className={getCharacterCountColor()}>
                  {sopText.length.toLocaleString()} / 10,000
                </span>
              </Badge>
            </CardTitle>
            <CardDescription>
              Write or paste your SOP below. We recommend 500-2000 words for a
              comprehensive review.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* File Upload */}
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
                id="sop-upload"
              />
              <label htmlFor="sop-upload">
                <Button variant="outline" size="sm" asChild>
                  <span className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Text File
                  </span>
                </Button>
              </label>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completeness</span>
                <span className="text-muted-foreground">
                  {Math.round(getProgressValue())}%
                </span>
              </div>
              <Progress value={getProgressValue()} className="h-2" />
            </div>

            {/* Text Area */}
            <Textarea
              placeholder="Start writing your Statement of Purpose here...

A strong SOP typically includes:
• Your academic background and achievements
• Research interests and career goals
• Why you chose this specific program
• Relevant experiences and skills
• Future aspirations and contributions

Remember to be authentic, specific, and compelling in your narrative."
              value={sopText}
              onChange={handleTextChange}
              className="min-h-[400px] resize-none"
            />

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Action Button */}
            <Button
              onClick={handleReview}
              disabled={
                isLoading || validationErrors.length > 0 || !sopText.trim()
              }
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing your SOP...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Review My SOP
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Feedback Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Review Results</span>
              {hasReviewed && (
                <Badge variant="default">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Reviewed
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Detailed feedback and suggestions to improve your SOP
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!hasReviewed && !isLoading && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Ready to Review</h3>
                <p className="text-muted-foreground">
                  Enter your SOP text and click "Review My SOP" to get detailed
                  feedback.
                </p>
              </div>
            )}

            {isLoading && (
              <div className="text-center py-12">
                <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin mb-4" />
                <h3 className="text-lg font-medium mb-2">Analyzing Your SOP</h3>
                <p className="text-muted-foreground">
                  Please wait while we review your statement for grammar, style,
                  and clarity.
                </p>
              </div>
            )}

            {hasReviewed && feedback && (
              <div className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <div
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: sopService.formatFeedback(feedback),
                    }}
                  />
                </div>

                {feedback.includes("No grammar or spelling errors") && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Great job! Your SOP appears to be well-written with no
                      major issues detected.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {/* AI Chatbot Feedback Section */}
      {hasReviewed && aiFeedback && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              AI Chatbot Feedback
              <Badge variant="secondary">Experimental</Badge>
            </CardTitle>
            <CardDescription>
              Feedback generated by a general-purpose AI to guide you on
              structure and storytelling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReactMarkdown className="prose prose-sm max-w-none">
              {/* <pre className="max-h-[500px] overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap prose prose-sm"> */}
              {aiFeedback}
              {/* </pre> */}
            </ReactMarkdown>
          </CardContent>
        </Card>
      )}

      {/* Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tips for a Strong SOP</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Structure</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Start with a compelling opening</li>
                <li>• Maintain logical flow between paragraphs</li>
                <li>• End with strong future goals</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-secondary">Content</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Be specific about your experiences</li>
                <li>• Show passion for your field</li>
                <li>• Connect past experiences to future goals</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-accent">Language</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use active voice</li>
                <li>• Avoid repetitive phrases</li>
                <li>• Maintain professional tone</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-orange-600">Formatting</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Keep paragraphs concise</li>
                <li>• Use proper punctuation</li>
                <li>• Check for typos and errors</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
