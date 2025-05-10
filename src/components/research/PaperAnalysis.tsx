
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, FileText, Download, BarChart, BookOpen, FileUp } from "lucide-react";

// Sample paper data
const paperData = {
  title: "Attention Is All You Need",
  authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "Jakob Uszkoreit", "Llion Jones", "Aidan N. Gomez", "Lukasz Kaiser", "Illia Polosukhin"],
  year: 2017,
  journal: "Neural Information Processing Systems",
  doi: "10.48550/arXiv.1706.03762",
  citations: 52000,
  abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.",
  keywords: ["Transformers", "Attention Mechanism", "Natural Language Processing", "Neural Networks", "Sequence Models"],
  sections: [
    { title: "Introduction", content: "Recurrent neural networks, long short-term memory and gated recurrent neural networks in particular, have been firmly established as state of the art approaches in sequence modeling and transduction problems such as language modeling and machine translation. Numerous efforts have since continued to push the boundaries of recurrent language models and encoder-decoder architectures..." },
    { title: "Background", content: "Self-attention, sometimes called intra-attention is an attention mechanism relating different positions of a single sequence in order to compute a representation of the sequence. Self-attention has been used successfully in a variety of tasks including reading comprehension, abstractive summarization, textual entailment and learning task-independent sentence representations..." },
    { title: "Model Architecture", content: "Most competitive neural sequence transduction models have an encoder-decoder structure. Here, the encoder maps an input sequence of symbol representations to a sequence of continuous representations. The decoder then generates an output sequence of symbols one element at a time..." },
    { title: "Experiments", content: "We conducted experiments on two machine translation tasks, evaluating on the WMT 2014 English-to-German and English-to-French translation tasks. On the English-to-German task, our big transformer model outperforms the best previously reported models by more than 2.0 BLEU, establishing a new state-of-the-art BLEU score of 28.4..." },
    { title: "Results", content: "On the English-to-French translation task, our big model achieves a BLEU score of 41.0, outperforming all of the previously published single models by more than 1.0 BLEU, achieving a new state-of-the-art on this task. For the base models, we observe a similar pattern, with the Transformer outperforming GNMT+MoE model..." },
    { title: "Conclusions", content: "In this work, we presented the Transformer, the first sequence transduction model based entirely on attention, replacing the recurrent layers most commonly used in encoder-decoder architectures with multi-headed self-attention. For translation tasks, the Transformer can be trained significantly faster than architectures based on recurrent or convolutional layers..." }
  ],
  figures: [
    { id: "fig1", title: "The Transformer Model Architecture", description: "The Transformer follows this overall architecture using stacked self-attention and point-wise, fully connected layers for both the encoder and decoder, shown in the left and right halves of Figure 1, respectively." },
    { id: "fig2", title: "Multi-Head Attention", description: "Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions." },
    { id: "fig3", title: "Training Cost", description: "Training cost of the base models on the English-to-German translation task." }
  ],
  references: [
    "Bahdanau, D., Cho, K., & Bengio, Y. (2014). Neural machine translation by jointly learning to align and translate. arXiv preprint arXiv:1409.0473.",
    "Cho, K., Van Merriënboer, B., Gulcehre, C., Bahdanau, D., Bougares, F., Schwenk, H., & Bengio, Y. (2014). Learning phrase representations using RNN encoder-decoder for statistical machine translation. arXiv preprint arXiv:1406.1078.",
    "Sutskever, I., Vinyals, O., & Le, Q. V. (2014). Sequence to sequence learning with neural networks. In Advances in neural information processing systems (pp. 3104-3112)."
  ]
};

export function PaperAnalysis() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-8/12">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="font-serif text-2xl">{paperData.title}</CardTitle>
                  <CardDescription className="text-base">
                    {paperData.authors.slice(0, 3).join(", ")}
                    {paperData.authors.length > 3 && ` + ${paperData.authors.length - 3} more`}
                    {" • "}{paperData.year}{" • "}{paperData.journal}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" /> Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {paperData.keywords.map((keyword, index) => (
                  <div key={index} className="bg-slate-100 text-xs px-2 py-1 rounded">
                    {keyword}
                  </div>
                ))}
              </div>
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Abstract</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {paperData.abstract}
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Citation</h3>
                <div className="bg-slate-50 p-3 rounded border text-xs">
                  Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). Attention is all you need. In Neural Information Processing Systems (pp. 5998-6008).
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:w-4/12">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Citations</span>
                  <span className="text-sm font-medium">{paperData.citations.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Published</span>
                  <span className="text-sm font-medium">{paperData.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Journal Impact</span>
                  <span className="text-sm font-medium">High (18.6)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">DOI</span>
                  <span className="text-sm font-medium truncate">{paperData.doi}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <BarChart className="h-4 w-4 mr-2" /> Impact Analysis
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <BookOpen className="h-4 w-4 mr-2" /> Related Papers
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <FileUp className="h-4 w-4 mr-2" /> Upload to Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Paper Content</CardTitle>
            <div className="relative w-[250px]">
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search in paper..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="fulltext">Full Text</TabsTrigger>
              <TabsTrigger value="figures">Figures</TabsTrigger>
              <TabsTrigger value="references">References</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="space-y-8">
                {paperData.sections.map((section, index) => (
                  <div key={index}>
                    <h3 className="font-serif text-lg font-medium mb-2">{section.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="fulltext">
              <div className="text-center py-10">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-40" />
                <h3 className="text-lg font-medium">Full text viewer</h3>
                <p className="text-muted-foreground mt-1">View the complete paper content with our interactive reader</p>
                <Button className="mt-4" size="sm">
                  Open Full Text
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="figures">
              <div className="space-y-6">
                {paperData.figures.map((figure) => (
                  <Card key={figure.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-center h-40 bg-slate-50 rounded mb-4">
                        <FileText className="h-12 w-12 text-muted-foreground opacity-40" />
                      </div>
                      <h3 className="font-medium mb-1">{figure.title}</h3>
                      <p className="text-sm text-muted-foreground">{figure.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="references">
              <div className="space-y-3">
                {paperData.references.map((reference, index) => (
                  <div key={index} className="p-3 border rounded">
                    <p className="text-sm">[{index + 1}] {reference}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
