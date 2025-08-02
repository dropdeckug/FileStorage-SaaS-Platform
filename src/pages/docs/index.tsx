import { Link } from "react-router-dom";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import atomOneDark from "react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark";
import atomOneLight from "react-syntax-highlighter/dist/esm/styles/hljs/atom-one-light";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PageLayout from "@/components/page-layout";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { useTheme } from "@/context/theme-provider";

SyntaxHighlighter.registerLanguage("javascript", js);

const Docs = () => {
  const { theme } = useTheme();
  const public_baseurl = `${import.meta.env.VITE_API_URL}`;
  const codeTheme = theme === "light" ? atomOneLight : atomOneDark;
  return (
    <PageLayout title="Docs" subtitle="Uploadnest API Documentation">
      <div className="mx-auto px-1">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Node.js SDK</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Integrate Uploadnest into your Node.js applications with our
            official SDK. Remember to create your API key on your{" "}
            <Link
              to={PROTECTED_ROUTES.APIKEYS}
              className="text-primary underline"
            >
              API Keys page
            </Link>
            .
          </p>

          <Card className="mb-5">
            <CardHeader>
              <CardTitle>Installation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-[#FAFAFA] dark:bg-[#282C34] border p-4 overflow-auto text-base !py-1">
                <SyntaxHighlighter style={codeTheme}>
                  {"npm install uploadnest"}
                </SyntaxHighlighter>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Usage</CardTitle>
              <CardDescription>
                Upload files with just a few lines of code.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-[#FAFAFA] dark:bg-[#282C34] border p-4 overflow-auto text-base !py-1">
                <SyntaxHighlighter style={codeTheme}>
                  {`import Uploadnest from 'uploadnest';
import fs from 'fs'; // fs is a Node.js module, this code runs on the server

const client = new Uploadnest({
  apiKey: process.env['UPLOADNEST_API_KEY'], // This is the default and can be omitted
});

async function uploadFile() {
  try {
    const response = await client.files.upload({ files: [fs.createReadStream('path/to/file')] });
    console.log(response.files);
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}
`}
                </SyntaxHighlighter>
              </div>
              <p className="mt-4 text-muted-foreground">
                For detailed information on request/response types and
                comprehensive error handling, please refer to the{" "}
                <a
                  href="https://www.npmjs.com/package/uploadnest"
                  className="text-primary underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SDK documentation on npm
                </a>
                .
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-6">Or use the API directly</h2>
          <Card>
            <CardHeader>
              <CardTitle>Public API Usage</CardTitle>
              <CardDescription>
                Interact with the Uploadnest API directly using standard HTTP
                requests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-[#FAFAFA] dark:bg-[#282C34] border p-4 overflow-auto text-base !py-2">
                <SyntaxHighlighter style={codeTheme}>
                  {`async function uploadFileDirectly(apiKey) {
  const formData = new FormData()
  formData.append('files', image.png);
  try {
    const response = await fetch('${public_baseurl}/v1/files/upload',{
      method:'POST',
      headers:{
        'Authorization': \`Bearer \${apiKeys}\`
      },
      body: formData
    });
    
    if (!response.ok) throw new Error(\`HTTP error! Status: \${response.status}\`);
    
    const data = await response.json();
    console.log('Upload successful:', data);
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}
  //Example Usage: uploadFileDirectly(<API_KEY>)
`}
                </SyntaxHighlighter>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Docs;
