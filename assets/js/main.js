document.addEventListener('DOMContentLoaded', async () => {
    const username = 'carlmonnaert';
    const projectList = document.getElementById('project-list');
    const loadingMessage = document.getElementById('loading-message');

    try {
        // Fetch public repositories sorted by recently updated
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const repos = await response.json();

        // Remove the loading text
        if (loadingMessage) {
            loadingMessage.remove();
        }

        // Filter out forks and your github.io repository
        const filteredRepos = repos.filter(repo => !repo.fork && repo.name !== `${username}.github.io`);

        filteredRepos.forEach(repo => {
            const article = document.createElement('article');
            article.className = 'project';

            // Extract the creation year for the date
            const date = new Date(repo.created_at).getFullYear();

            // Format repo name (e.g., "python-interpreter" -> "Python Interpreter")
            const title = repo.name.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());

            // Combine GitHub's primary language and topics for the tech stack
            const techStack = [];
            if (repo.language) techStack.push(repo.language);
            if (repo.topics && repo.topics.length > 0) {
                techStack.push(...repo.topics);
            }

            // Generate HTML for the tags if any exist
            const techStackHTML = techStack.length > 0 
                ? `<ul class="tech-stack">${techStack.map(tech => `<li>${tech}</li>`).join('')}</ul>`
                : '';

            // Build the project card
            article.innerHTML = `
                <h2><a href="${repo.html_url}" target="_blank" style="text-decoration: none; color: inherit;">${title}</a></h2>
                <span class="date">${date}</span>
                <p>${repo.description ? repo.description : 'No description provided on GitHub.'}</p>
                ${techStackHTML}
            `;

            projectList.appendChild(article);
        });

    } catch (error) {
        console.error("Failed to fetch GitHub projects:", error);
        projectList.innerHTML = '<p>Unable to load projects at this time. Please visit my <a href="https://github.com/carlmonnaert">GitHub profile</a> directly.</p>';
    }
});
