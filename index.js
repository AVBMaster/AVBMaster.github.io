document.addEventListener("DOMContentLoaded", function () {
  const token = "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"; // 替换为你的 GitHub Token
  const gistId = "38f4c48e4738226084e24db38aff9ef7"; // 替换为你的 Gist ID

  const updateVisits = async () => {
    const now = new Date();
    const visitTime = now.toISOString();

    // 获取 Gist 内容
    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        Authorization: `token ${token}`,
      },
    });
    const gistData = await response.json();
    const files = gistData.files;
    const visitsFile = files["visits.json"];

    if (!visitsFile) {
      console.error("visits.json file not found in Gist.");
      return;
    }

    // 更新 Gist 内容
    const content = atob(visitsFile.content);
    const visits = JSON.parse(content);
    visits.push(visitTime);

    const updatedContent = btoa(JSON.stringify(visits));

    await fetch(`https://api.github.com/gists/${gistId}`, {
      method: "PATCH",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files: {
          "visits.json": {
            content: updatedContent,
          },
        },
      }),
    });
  };

  updateVisits().catch(console.error);
});
