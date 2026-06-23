using System;
using Microsoft.EntityFrameworkCore;
using Project.DatabaseUtilities;
using Project.LoggingUtilities;
using Project.ServerUtilities;



// Creates the project's database and names it "database"
class Database() : DatabaseCore("database")
{
    // Creates a table that stores all Question objects
    public DbSet<Question> Questions { get; set; } = default!;
}

class Program
{
    static void Main()
    {
        // Sets the port that the server will run on
        int port = 5000;

        // Creates the server
        var server = new Server(port);

        // Connects to the database
        var database = new Database();

        // Prints information to the console
        Console.WriteLine("Server is running!");
        Console.WriteLine($"http://localhost:{port}/website/pages/index.html");

        // Keeps the server running forever
        while (true)
        {
            // Waits until a request is received from the client
            var request = server.WaitForRequest();

            // Prints the request name for debugging
            Console.WriteLine($"Received: {request.Name}");

            try
            {
                // Returns all questions from the database
                if (request.Name == "getQuestions")
                {
                    request.Respond(database.Questions);
                }

                // Adds a new question to the database
                else if (request.Name == "addQuestion")
                {
                    // Receives the question text and both answer options
                    var (text, a, b) = request.GetParams<(string, string, string)>();

                    // Checks if the question text is empty
                    if (string.IsNullOrWhiteSpace(text))
                    {
                        request.SetStatusCode(400);
                        request.Respond("Question is missing");
                        return;
                    }

                    // Checks if Option A is empty
                    if (string.IsNullOrWhiteSpace(a))
                    {
                        request.SetStatusCode(400);
                        request.Respond("Option A is missing");
                        return;
                    }

                    // Checks if Option B is empty
                    if (string.IsNullOrWhiteSpace(b))
                    {
                        request.SetStatusCode(400);
                        request.Respond("Option B is missing");
                        return;
                    }

                    // Creates a new Question object and adds it to the database
                    database.Questions.Add(new Question
                    {
                        Text = text,
                        OptionA = a,
                        OptionB = b
                    });

                    // Saves the changes permanently
                    database.SaveChanges();
                }

                // Deletes all questions from the database
                else if (request.Name == "clearQuestions")
                {
                    database.Questions.RemoveRange(database.Questions);

                    // Saves the deletion
                    database.SaveChanges();
                }

                // Handles voting for a question
                else if (request.Name == "vote")
                {
                    // Receives the question ID and the chosen option
                    var (id, option) = request.GetParams<(int, string)>();

                    // Finds the matching question in the database
                    var question = database.Questions.Find(id);

                    // Makes sure the question exists
                    if (question != null)
                    {
                        // Increases the vote count for Option A
                        if (option == "A")
                        {
                            question.VotesA++;
                        }
                        // Otherwise increases the vote count for Option B
                        else
                        {
                            question.VotesB++;
                        }

                        // Saves the updated vote counts
                        database.SaveChanges();

                        // Sends a success response back to the client
                        request.Respond("OK");
                    }
                }
            }

            // Runs if an unexpected error occurs
            catch (Exception exception)
            {
                // Sends an Internal Server Error status code
                request.SetStatusCode(500);

                // Writes the exception details to the log
                Log.WriteException(exception);
            }
        }
    }
}

// Represents a single question in the database
class Question
{
    // Unique ID of the question
    public int Id { get; set; }

    // The question text
    public string Text { get; set; } = "";

    // The first answer option
    public string OptionA { get; set; } = "";

    // The second answer option
    public string OptionB { get; set; } = "";

    // Number of votes for Option A
    public int VotesA { get; set; }

    // Number of votes for Option B
    public int VotesB { get; set; }
}