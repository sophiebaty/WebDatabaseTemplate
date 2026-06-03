using System;
using Microsoft.EntityFrameworkCore;
using Project.DatabaseUtilities;
using Project.LoggingUtilities;
using Project.ServerUtilities;



class Database() : DatabaseCore("database")
{
    public DbSet<Question> Questions { get; set; } = default!;
}

class Program
{
    static void Main()
    {
        int port = 5000;

        var server = new Server(port);
        var database = new Database();

        Console.WriteLine("Server is running!");
        Console.WriteLine($"http://localhost:{port}/website/pages/index.html");

        while (true)
        {
            var request = server.WaitForRequest();

            Console.WriteLine($"Received: {request.Name}");

            try
            {
                if (request.Name == "getQuestions")
                {
                    request.Respond(database.Questions);
                }
                else if (request.Name == "addQuestion")
                {
                   var (text, a, b) = request.GetParams<(string, string, string)>();

                  if (string.IsNullOrWhiteSpace(text))
                {
                   request.SetStatusCode(400);
                    request.Respond("Question is missing");
                   return;
                }

                  if (string.IsNullOrWhiteSpace(a))
                  {
                    request.SetStatusCode(400);
                    request.Respond("Option A is missing");
                    return;
                 }

                if (string.IsNullOrWhiteSpace(b))
                {
                  request.SetStatusCode(400);
                  request.Respond("Option B is missing");
                  return;
                 }

                database.Questions.Add(new Question
                {
                Text = text,
                OptionA = a,
                OptionB = b
                });

                 database.SaveChanges();
                 }


                else if (request.Name == "clearQuestions")
                {
                    database.Questions.RemoveRange(database.Questions);
                    database.SaveChanges();
                }

                else if (request.Name == "vote")
                {
                 var (id, option) = request.GetParams<(int, string)>();
 
                 var question = database.Questions.Find(id);

                 if (question != null)
                 {
                 if (option == "A")
                 {
                   question.VotesA++;
                 }
                 else
                {
                  question.VotesB++;
                 }

                  database.SaveChanges();

                 request.Respond("OK");
                 }
                }
            }
            catch (Exception exception)
            {
                request.SetStatusCode(500);
                Log.WriteException(exception);
            }

           }
        }
    }


class Question
{
    public int Id { get; set; }

    public string Text { get; set; } = "";

    public string OptionA { get; set; } = "";

    public string OptionB { get; set; } = "";

    public int VotesA { get; set; }

    public int VotesB { get; set; }
}