while (true) {
  const command = new Deno.Command(Deno.execPath(), {
    args: [
      "run",
      "-A",
      import.meta.resolve("./src/register-commands.ts"),
    ],
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  });
  const child = command.spawn();
  child.stdout.pipeTo(Deno.stdout.writable);
  child.stderr.pipeTo(Deno.stderr.writable);
  child.stdin.close();
  try {
    const status = await child.status;
    console.log("status:", status);
  } catch (e) {
    console.error(e);
  }
}
